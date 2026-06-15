import { GoogleGenAI } from "@google/genai";
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

  // Check if user requested a script reset
  const args = process.argv.slice(2);
  const resetVerified = args.includes("--reset");

  console.log("Reading bangla1st_mcq_goddo.json...");
  if (!fs.existsSync(filePath)) {
    console.error(`File not found at ${filePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(rawData);

  if (resetVerified) {
    console.log("Resetting all verified_by_ai flags to clear previous run cache...");
    data.questions.forEach((q: any) => {
      delete q.verified_by_ai;
    });
    saveFile(data);
  }

  // Filter for questions that are not yet verified by AI
  const toBeChecked = data.questions.filter((q: any) => !q.verified_by_ai);

  console.log(`Total questions: ${data.questions.length}`);
  console.log(`To verify (remaining): ${toBeChecked.length} questions`);

  if (toBeChecked.length === 0) {
    console.log("All questions are already verified and corrected!");
    return;
  }

  // We will process with batch size of 20 - very safe and has high reasoning context
  const BATCH_SIZE = 20;
  
  // Guard against timeout: Approaching 4.2 minutes, we stop gracefully and save
  const startTime = Date.now();
  const TIMEOUT_MS = 250000; // 4.1 minutes

  let checkedCount = 0;
  let correctCount = 0;
  let fixedCount = 0;

  // Manual override for ID 1 to ensure 100% correct user-reported question
  const manualAnswers: { [key: number]: { correct_index: number; explanation: string } } = {
    1: {
      correct_index: 3, // "ঘ. মামার"
      explanation: "সঠিক উত্তর হল ঘ. মামার। রবীন্দ্রনাথ ঠাকুরের 'অপরিচিতা' গল্পে বিয়ের আসরে গয়না পরীক্ষা করার সময় অনুপমের পরিবারকে নিয়ন্ত্রণকারী মামা অত্যন্ত জেদ ও একগুঁয়েমি প্রকাশ করতে গিয়ে বলেছিলেন, 'আমি যা বলিব তাই হইবে'।"
    }
  };

  // Split into batches
  const batches: any[][] = [];
  for (let i = 0; i < toBeChecked.length; i += BATCH_SIZE) {
    batches.push(toBeChecked.slice(i, i + BATCH_SIZE));
  }

  // Limit each run to at most 5 batches (100 questions) to complete well under 1 minute safely
  const BATCHES_PER_RUN = 5;
  const activeBatches = batches.slice(0, BATCHES_PER_RUN);

  console.log(`Divided into ${batches.length} batches of up to ${BATCH_SIZE} questions each.`);
  console.log(`Processing up to ${activeBatches.length} batches in this run to keep execution under 1 minute...\n`);

  for (let b = 0; b < activeBatches.length; b++) {
    // Check for approaching timeout
    if (Date.now() - startTime > TIMEOUT_MS) {
      console.log(`\n⚠️ Approaching script execution run timeout limit (${TIMEOUT_MS / 1000}s). Saving progress and exiting...`);
      saveFile(data);
      console.log(`Progress saved. Please run the script again to continue checking remaining questions.`);
      return;
    }

    const currentBatch = batches[b];
    console.log(`==================================================`);
    console.log(`Processing Batch ${b + 1}/${batches.length} (${currentBatch.length} questions)...`);

    // Extract questions that don't have manual overrides
    const questionsToQuery = currentBatch.filter(q => manualAnswers[q.id] === undefined);
    const questionsWithManual = currentBatch.filter(q => manualAnswers[q.id] !== undefined);

    // Apply manual overrides immediately
    for (const mq of questionsWithManual) {
      const override = manualAnswers[mq.id];
      console.log(`[Q ID ${mq.id} - MANUAL OVERRIDE] Setting correct_index: ${override.correct_index}`);
      mq.ans = override.correct_index;
      mq.answer = override.explanation;
      mq.verified_by_ai = true;
      fixedCount++;
      checkedCount++;
    }

    if (questionsToQuery.length === 0) {
      saveFile(data);
      continue;
    }

    // Format for Gemini prompt
    const batchPromptData = questionsToQuery.map((q) => {
      const textContent = q.question_parts
        ? q.question_parts
            .filter((p: any) => p.type === "text")
            .map((p: any) => p.content)
            .join("\n")
        : q.questionText || "";

      const optionsFormatted = (q.options || []).map((opt: any, idx: number) => {
        return `${idx}: (${opt.label || ""}) ${opt.text || ""}`;
      });

      return {
        id: q.id,
        question: textContent,
        options: optionsFormatted,
        current_ans: q.ans !== undefined ? q.ans : null,
        current_explanation: q.answer || "",
      };
    });

    let attempt = 0;
    let success = false;

    while (attempt < 3 && !success) {
      attempt++;
      try {
        console.log(`Call to Gemini API (Batch ${b + 1}, Attempt ${attempt}/3)...`);

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `You are an absolute expert academic and textbook authority on HSC Bangla 1st Paper (Higher Secondary Certificate, NCTB Syllabus, Bangladesh).
You have complete knowledge of all Prose/Stories/Essays (Godyo): "Aparajita", "Bilasi", "Chashi", "Amar Path", "Manob-Kallyan", "Mashi-Pishi", "Bayanner Dingulo", "Reinkot" (Raincoat), etc.

Your task is to audit the provided batch of multiple-choice questions (MCQs).
For each question:
1. Thoroughly verify what the correct option index (0 to 3) is according to the NCTB textbook.
2. Even if there is current_ans or current_explanation, DO NOT trust them blindly. Examine the question statement and options, identify the true textbook option.
3. If the options contain typos (e.g. "শস্তনাথ বাবু" instead of "শম্ভুনাথ বাবু"), choose the option that refers to the correct character/answer.
4. Elaborate a clear, detailed 2-3 sentence Bengali textbook-level explanation. The explanation MUST begin with exactly: "সঠিক উত্তর হল <কারেক্ট_লেবেল_যেমন- ক./খ./গ./ঘ.> <কারেক্ট_অপশনের_লেখা>।" (Do NOT use markdown bold markup for label/text, just plain text).
5. Return a strict JSON response containing a single "verifications" key with an array of objects.

Input questions:
${JSON.stringify(batchPromptData, null, 2)}

Expected Output Format:
{
  "verifications": [
    {
      "id": <id>,
      "status": "correct" or "fixed",
      "correct_index": <correct_index_number_0_to_3>,
      "explanation": "<bengali_explanation_starting_with_right_format_clause>"
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

        if (responseData && Array.isArray(responseData.verifications)) {
          console.log(`Received audit results for ${responseData.verifications.length} questions.`);

          for (const verification of responseData.verifications) {
            const matchQ = currentBatch.find((q) => q.id === verification.id);
            if (matchQ) {
              const status = verification.status;
              const newIdx = Number(verification.correct_index);

              // Update the question fields
              matchQ.ans = newIdx;
              matchQ.answer = verification.explanation;
              matchQ.verified_by_ai = true;
              
              if (status === "fixed" || matchQ.ans !== newIdx) {
                console.log(`[Q ID ${matchQ.id} - FIXED] New Index: ${newIdx}`);
                fixedCount++;
              } else {
                correctCount++;
              }
              checkedCount++;
            }
          }

          // Save atomically
          saveFile(data);
          success = true;
          console.log(`✅ Batch ${b + 1} processed successfully.`);
        } else {
          throw new Error("Response JSON does not contain 'verifications' array.");
        }
      } catch (error: any) {
        console.error(`❌ Error in Batch ${b + 1} (Attempt ${attempt}/3):`, error.message);
        if (attempt < 3) {
          const delayTime = 4000 * attempt;
          console.log(`Sleeping for ${delayTime}ms before retrying...`);
          await sleep(delayTime);
        } else {
          console.error(`🔥 Skipping batch ${b + 1} after 3 failed attempts.`);
        }
      }
    }

    // Cooldown sleep to prevent HTTP 429 rate limit
    if (b < batches.length - 1) {
      console.log(`Cooling down (sleeping 4 seconds)...`);
      await sleep(4000);
    }
  }

  console.log(`\n==================================================`);
  console.log("Verification run complete!");
  console.log(`Total checked in this run: ${checkedCount}`);
  console.log(`Correct (matched): ${correctCount}`);
  console.log(`Fixed / Corrected: ${fixedCount}`);
}

function saveFile(data: any) {
  try {
    const raw = JSON.stringify(data, null, 2);
    const tempPath = filePath + ".tmp";
    fs.writeFileSync(tempPath, raw, "utf-8");
    fs.renameSync(tempPath, filePath);
    console.log("Data successfully saved to file!");
  } catch (err: any) {
    console.error("Error writing JSON to disk:", err.message);
  }
}

main();
