import fs from "fs";
import path from "path";

console.log("Generating sitemap.xml...");

// Helper: load all questions
function loadQuestions(): any[] {
  const qDB: any[] = [];
  const baseDir = path.join(process.cwd(), "uploaded_questions");
  
  if (!fs.existsSync(baseDir)) {
    console.warn("No uploaded_questions directory found.");
    return qDB;
  }

  function walkSync(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkSync(filePath);
      } else if (file.endsWith(".json")) {
        try {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          let data = JSON.parse(fileContent);
          
          const questionsArray = Array.isArray(data) ? data : (data.questions || []);
          if (Array.isArray(questionsArray)) {
            for (const q of questionsArray) {
              if (q && q.id) {
                qDB.push(q);
              }
            }
          }
        } catch (err) {
          console.error(`Error parsing JSON from ${filePath}:`, err);
        }
      }
    }
  }

  walkSync(baseDir);
  return qDB;
}

const BLOG_POSTS = [
  { slug: "hsc-chemistry-1st-paper-suggestion-2025" },
  { slug: "dhaka-university-admission-marks-distribution" }
];

try {
  const qDB = loadQuestions();
  const baseUrl = "https://chorcha.ai";
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  const corePages = ["", "/dashboard", "/exam-war", "/question-bank", "/study-materials", "/leaderboard"];
  corePages.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${p === "" ? "1.0" : "0.8"}</priority>\n  </url>\n`;
  });

  BLOG_POSTS.forEach(b => {
    xml += `  <url>\n    <loc>${baseUrl}/blog/${b.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  qDB.forEach((q: any) => {
    xml += `  <url>\n    <loc>${baseUrl}/question/${q.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  
  console.log(`✅ Sitemap created successfully at: ${outPath}`);
  console.log(`📊 Total URLs indexed: ${corePages.length + BLOG_POSTS.length + qDB.length}`);
} catch (err) {
  console.error("Error generating sitemap:", err);
  process.exit(1);
}
