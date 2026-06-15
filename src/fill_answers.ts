import { GoogleGenAI, Type } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const filePath = path.resolve(
  process.cwd(),
  "uploaded_questions/hsc/Bangla1st/mcq/bangla1st_mcq_goddo.json"
);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("No GEMINI_API_KEY found in process.env");
    process.exit(1);
  }

  console.log("Reading Bangla 1st Paper MCQ JSON dataset...");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(rawData);

  // Find all questions that need an answer under the new "ans" property
  // If 'ans' is undefined, null, or empty string, we need to solve it
  const toBeSolved = data.questions.filter(
    (q: any) => q.ans === undefined || q.ans === null || q.ans === ""
  );

  console.log(
    `Total questions: ${data.questions.length}`
  );
  console.log(`Unsolved (questions without an 'ans' field): ${toBeSolved.length}`);

  if (toBeSolved.length === 0) {
    console.log("All questions are already answered under the 'ans' property!");
    return;
  }

  // Define batch size (30 is highly efficient and safe for token limits)
  const BATCH_SIZE = 30;
  const batches: any[][] = [];
  for (let i = 0; i < toBeSolved.length; i += BATCH_SIZE) {
    batches.push(toBeSolved.slice(i, i + BATCH_SIZE));
  }

  console.log(`Divided into ${batches.length} batches of up to ${BATCH_SIZE} questions each.\n`);

  let solvedCount = 0;

  for (let b = 0; b < batches.length; b++) {
    const currentBatch = batches[b];
    console.log(`==================================================`);
    console.log(`Processing Batch ${b + 1}/${batches.length} (${currentBatch.length} questions)...`);

    // Pre-filter: if a question has 0 options/empty options, mark it with q.ans = -1 immediately
    const validQuestionsInBatch = [];
    for (const q of currentBatch) {
      if (!q.options || q.options.length === 0) {
        console.log(`[Q ID ${q.id}] Skipping due to 0 options.`);
        q.ans = -1;
        q.answer = -1;
        saveFile(data);
        solvedCount++;
      } else {
        validQuestionsInBatch.push(q);
      }
    }

    if (validQuestionsInBatch.length === 0) {
      console.log("No valid questions to send in this batch.");
      continue;
    }

    // Format the valid questions for prompt
    const batchPromptData = validQuestionsInBatch.map((q) => {
      const textContent = q.question_parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.content)
        .join("\n");
      
      const optionsFormatted = q.options.map((opt: any, idx: number) => {
        return `${idx}: (Label: ${opt.label}) Text: ${opt.text}`;
      });

      return {
        id: q.id,
        question: textContent,
        options: optionsFormatted,
      };
    });

    let attempt = 0;
    let success = false;

    while (attempt < 3 && !success) {
      attempt++;
      try {
        console.log(`Call to Gemini API (Batch ${b + 1}, Attempt ${attempt}/3)...`);
        
        // Use gemini-3.1-flash-lite as it is highly efficient and runs fast
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: `You are an expert of HSC Bangla 1st Paper (Higher Secondary Certificate, Bengali literature).
Solve the following multiple choice questions (MCQ) scientifically, accurately, and strictly following the Bengali HSC curriculum.

Questions to solve in this batch:
${JSON.stringify(batchPromptData, null, 2)}

Instructions:
1. For each question prompt, find the correct option.
2. The answer MUST be the corresponding index number (0, 1, 2, or 3) of the correct option as listed above.
3. Return a unified response containing the results for all the questions in the batch.
4. Your response MUST be a strict JSON object with a single "solutions" key that contains an array of objects.
   Each object in the array MUST contain:
   - "id": number (the question ID)
   - "correct_index": number (integer index of correct option, should be between 0 and options.length - 1)
   - "explanation": string (short Bengali explanation under 2 sentences)

Expected format:
{
  "solutions": [
    {
      "id": <id_value>,
      "correct_index": <correct_index_value>,
      "explanation": "<short_bangla_explanation>"
    }
  ]
}`,
          config: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        });

        const outputText = response.text.trim();
        const responseData = JSON.parse(outputText);

        if (responseData && Array.isArray(responseData.solutions)) {
          console.log(`Received solutions for ${responseData.solutions.length} questions.`);
          
          let validSolutionsCount = 0;
          for (const sol of responseData.solutions) {
            const matchQ = validQuestionsInBatch.find((q) => q.id === sol.id);
            if (matchQ) {
              const numIndex = Number(sol.correct_index);
              if (!isNaN(numIndex) && numIndex >= 0 && numIndex < matchQ.options.length) {
                // Set the correct answer and clean "ans" property
                matchQ.ans = numIndex;
                matchQ.answer = numIndex; // Keep both updated to match user request
                validSolutionsCount++;
              } else {
                console.warn(`[Q ID ${sol.id}] Invalid correct_index returned: ${sol.correct_index}`);
              }
            }
          }

          // Save current state of the JSON file
          saveFile(data);
          solvedCount += validSolutionsCount;
          success = true;
          console.log(`✅ Successfully saved ${validSolutionsCount} answers for this batch.`);
        } else {
          throw new Error("Response JSON does not contain 'solutions' array.");
        }

      } catch (error: any) {
        console.error(`❌ Error in Batch ${b + 1} (Attempt ${attempt}/3):`, error.message);
        if (attempt < 3) {
          const delayTime = 5000 * attempt;
          console.log(`Sleeping for ${delayTime}ms before retrying...`);
          await sleep(delayTime);
        } else {
          console.error(`🔥 Skipping batch ${b + 1} after 3 failed attempts.`);
        }
      }
    }

    // Always wait between batches to play extremely safe with the 15 RPM rate limits
    if (b < batches.length - 1) {
      console.log(`Cooling down (sleeping 4.2 seconds)...`);
      await sleep(4200);
    }
  }

  console.log(`\n==================================================`);
  console.log(`All operations completed! Successfully solved and updated ${solvedCount} questions.`);
}

function saveFile(data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err: any) {
    console.error("Error writing JSON to disk:", err.message);
  }
}

main();
