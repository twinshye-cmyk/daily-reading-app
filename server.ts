import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "5mb" }));

// ================= PERSISTENT SHARED DATA STORAGE =================
const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface ServerDatabase {
  profiles: any[];
  studyRecords: any[];
  savedWords: any[];
  customPassages: any[];
  updatedAt: string;
}

const DEFAULT_SERVER_DB: ServerDatabase = {
  profiles: [
    {
      id: "user-mom",
      name: "열공마미",
      grade: "",
      targetLevel: "전체 관리 및 학습 지도",
      avatarTheme: "spider-red",
      createdAt: new Date().toISOString(),
      isMomOrAdmin: true,
      momEncouragement: null,
    },
  ],
  studyRecords: [],
  savedWords: [],
  customPassages: [],
  updatedAt: new Date().toISOString(),
};

let inMemoryDb: ServerDatabase = { ...DEFAULT_SERVER_DB };

function sanitizeProfiles(profiles: any[]): any[] {
  if (!Array.isArray(profiles)) return DEFAULT_SERVER_DB.profiles;

  const result: any[] = [];
  let momAdminFound = false;

  for (const p of profiles) {
    if (!p || !p.name) continue;

    // Check if this is the Mom Admin profile (by name, isMomOrAdmin, or id)
    if (p.id === 'user-mom' || p.name === '열공마미' || p.isMomOrAdmin === true) {
      if (!momAdminFound) {
        result.push({
          id: 'user-mom',
          name: '열공마미',
          grade: '',
          targetLevel: '전체 관리 및 학습 지도',
          avatarTheme: p.avatarTheme || 'spider-red',
          createdAt: p.createdAt || new Date().toISOString(),
          isMomOrAdmin: true,
          momEncouragement: null,
        });
        momAdminFound = true;
      }
      // Skip any additional/duplicate '열공마미' or 'user-default' entries
      continue;
    }

    // Skip old 'user-default' if it wasn't caught
    if (p.id === 'user-default') continue;

    // Prevent duplicate learner IDs
    if (!result.some((existing) => existing.id === p.id)) {
      result.push(p);
    }
  }

  // If no mom admin exists, prepend default
  if (!momAdminFound) {
    result.unshift(DEFAULT_SERVER_DB.profiles[0]);
  }

  return result;
}

function initDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      inMemoryDb = {
        profiles: sanitizeProfiles(parsed.profiles),
        studyRecords: parsed.studyRecords || [],
        savedWords: parsed.savedWords || [],
        customPassages: parsed.customPassages || [],
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
      saveDatabaseToFile();
    } else {
      saveDatabaseToFile();
    }
  } catch (err) {
    console.warn("DB init error, using defaults:", err);
    inMemoryDb = { ...DEFAULT_SERVER_DB };
  }
}

function saveDatabaseToFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    inMemoryDb.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDb, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to DB file:", err);
  }
}

initDatabase();

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Helper function to call Gemini with multi-model fallback and retries
async function generateWithFallback(prompt: string, schema: any): Promise<string> {
  const ai = getAi();
  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-3.7-flash",
  ];

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`Attempting generation with model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} failed:`, err.message || err);
      lastError = err;
      // If 503 or 429, continue immediately to next fallback model
    }
  }

  throw lastError || new Error("All AI models are currently busy. Please try again in a moment.");
}

// Generate Custom CSAT Passage
app.post("/api/generate-passage", async (req, res) => {
  try {
    const { topic, level, category, questionType, grade, difficulty } = req.body;

    const targetGrade = grade || "고2/고3";
    const targetDifficulty = difficulty || "실전";
    const targetLevelDesc = level || `${targetGrade} ${targetDifficulty}`;

    const prompt = `You are an elite Korean CSAT (수능) English examination author and educator.
Create an authentic, intellectually stimulating, academic English reading passage and complete learning worksheet package tailored for the student's grade and difficulty level.

Target Specifications:
- Target Student Grade: ${targetGrade}
- Target Difficulty: ${targetDifficulty} (${targetLevelDesc})
- Topic / Category: ${topic || "Modern science & society"} (${category || "융합/학술"})
- Question Type: ${questionType || "빈칸추론"}
- Passage Length & Format: Strictly match authentic Korean CSAT (수능) standard reading passage length: 150-185 English words. Provide 6 to 9 logically dense, coherent, and academically rich sentences (Thesis / Introduction -> Elaboration / Counter-argument -> Supporting Evidence / Mechanism -> Nuance -> Conclusion). Structure the whole passage as 1 coherent paragraph (or 2 at most for clear dual-perspective contrast).
- Vocabulary & Sentence Complexity: Match vocabulary and syntactic complexity accurately to the selected grade (${targetGrade}) and difficulty (${targetDifficulty}). Include authentic CSAT-style syntax (participial clauses, relative clauses, subjunctive structures, cleft sentences, nominalizations).
- Requirements: Provide complete Korean translation, chunked sentence-by-sentence analysis (직독직해), 5 essential academic vocabulary words with phonetics and usage, a 5-choice CSAT style multiple choice question, and Korean background knowledge explanation.

Respond strictly in JSON matching the schema.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Engaging English title" },
        titleKo: { type: Type.STRING, description: "Korean translation of the title" },
        category: { type: Type.STRING, description: "science, humanities, social, tech, psychology, art, or economy" },
        level: { type: Type.STRING, description: "고1 기초, 고2 실력, 고3/수능 실전, or 수능 고난도 킬러" },
        wordCount: { type: Type.NUMBER, description: "Word count" },
        readTimeMinutes: { type: Type.NUMBER, description: "Estimated read time in minutes" },
        source: { type: Type.STRING, description: "Source label (e.g., EBS 연계 AI 맞춤형)" },
        backgroundKnowledge: { type: Type.STRING, description: "1-2 sentences of background knowledge context in Korean" },
        paragraphs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              paragraphNumber: { type: Type.NUMBER },
              textEn: { type: Type.STRING },
              textKo: { type: Type.STRING },
              sentenceBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sentenceEn: { type: Type.STRING },
                    chunks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          chunkEn: { type: Type.STRING },
                          chunkKo: { type: Type.STRING },
                        },
                        required: ["chunkEn", "chunkKo"],
                      },
                    },
                    grammarTip: { type: Type.STRING, description: "Key syntax or grammar point in Korean" },
                  },
                  required: ["sentenceEn", "chunks"],
                },
              },
            },
            required: ["paragraphNumber", "textEn", "textKo", "sentenceBreakdown"],
          },
        },
        vocabulary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              phonetic: { type: Type.STRING },
              partOfSpeech: { type: Type.STRING },
              meaningKo: { type: Type.STRING },
              exampleEn: { type: Type.STRING },
              exampleKo: { type: Type.STRING },
              synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
              csatImportance: { type: Type.STRING, description: "⭐⭐⭐ (필수) or ⭐⭐ (빈출) or ⭐ (심화)" },
            },
            required: ["word", "partOfSpeech", "meaningKo", "exampleEn", "exampleKo", "csatImportance"],
          },
        },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              questionEn: { type: Type.STRING },
              questionKo: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    num: { type: Type.NUMBER },
                    text: { type: Type.STRING },
                  },
                  required: ["num", "text"],
                },
              },
              correctAnswer: { type: Type.NUMBER, description: "1 to 5" },
              explanation: { type: Type.STRING, description: "Detailed Korean explanation of the logic and answer rationale" },
              tip: { type: Type.STRING, description: "CSAT solving tip or trap avoidance tip" },
            },
            required: ["id", "type", "questionEn", "questionKo", "options", "correctAnswer", "explanation", "tip"],
          },
        },
        writingOrSummaryTask: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING },
            guide: { type: Type.STRING },
            modelAnswer: { type: Type.STRING },
          },
          required: ["prompt", "guide", "modelAnswer"],
        },
      },
      required: [
        "title",
        "titleKo",
        "category",
        "level",
        "wordCount",
        "readTimeMinutes",
        "source",
        "backgroundKnowledge",
        "paragraphs",
        "vocabulary",
        "questions",
        "writingOrSummaryTask",
      ],
    };

    const text = await generateWithFallback(prompt, schema);
    const parsed = JSON.parse(text || "{}");
    parsed.id = "custom-" + Date.now();
    parsed.createdAt = new Date().toISOString();
    parsed.isCustomAi = true;

    res.json({ success: true, passage: parsed });
  } catch (error: any) {
    console.error("Passage generation error:", error);
    const userFriendlyError = error.message?.includes("503") || error.message?.includes("UNAVAILABLE")
      ? "AI 서버가 일시적으로 혼잡합니다. 1~2초 후 다시 시도해주세요."
      : error.message || "지문 생성 중 문제가 발생했습니다.";
    res.status(500).json({ success: false, error: userFriendlyError });
  }
});

// Analyze Selected Sentence (Deep syntax analysis)
app.post("/api/analyze-sentence", async (req, res) => {
  try {
    const { sentence, context } = req.body;
    if (!sentence) {
      return res.status(400).json({ error: "Sentence is required" });
    }

    const prompt = `Analyze this English sentence for a Korean high school student preparing for the CSAT (수능).
Sentence: "${sentence}"
Context (Surrounding text): "${context || ""}"

Provide:
1. Exact grammatical breakdown (Subject, Verb, Object/Complement, Modifiers, Clauses).
2. Chunk-by-chunk translation (직독직해).
3. Core grammar point (수능 핵심 어법 포인트 e.g., 분사구문, 관계사, 가정법, 도치 등).
4. Key vocabulary used in context.
5. High school student comprehension tip.

Output strictly in JSON.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING, description: "주어부 분석" },
        predicate: { type: Type.STRING, description: "서술어(동사) 및 목적어/보어부" },
        modifiers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "수식어구 (전치사구, 분사구 등)" },
        clauses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "종속절/관계사절" },
        chunks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              en: { type: Type.STRING },
              ko: { type: Type.STRING },
            },
            required: ["en", "ko"],
          },
        },
        grammarPoint: { type: Type.STRING, description: "핵심 어법 설명" },
        koreanTranslation: { type: Type.STRING, description: "자연스러운 우리말 번역" },
        studyTip: { type: Type.STRING, description: "수능 독해 팁" },
      },
      required: ["subject", "predicate", "chunks", "grammarPoint", "koreanTranslation", "studyTip"],
    };

    const text = await generateWithFallback(prompt, schema);
    const parsed = JSON.parse(text || "{}");
    res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error("Sentence analysis error:", error);
    const userFriendlyError = error.message?.includes("503") || error.message?.includes("UNAVAILABLE")
      ? "AI 서버가 일시적으로 혼잡합니다. 잠시 후 다시 시도해주세요."
      : error.message || "문장 분석 중 오류가 발생했습니다.";
    res.status(500).json({ success: false, error: userFriendlyError });
  }
});

// AI Tutor Chat / Explanation
app.post("/api/tutor-chat", async (req, res) => {
  try {
    const { question, passageText, studentQuery } = req.body;
    const ai = getAi();

    const prompt = `You are an encouraging and sharp Korean high school English exam tutor (수능 영어 1등급 코치).
Passage context: "${passageText || ""}"
Question details: "${JSON.stringify(question || {})}"
Student's question/concern: "${studentQuery}"

Answer concisely, kindly, and logically in Korean. Explain WHY the correct answer is right and clarify any common traps or confusion. Keep it engaging and actionable.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error("Tutor chat error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to get tutor reply" });
  }
});

// ================= SHARED DATA & ADMIN MANAGEMENT ENDPOINTS =================

// 1. Full Synchronization Endpoint
app.get("/api/sync-all", (req, res) => {
  try {
    res.json({
      success: true,
      profiles: inMemoryDb.profiles,
      studyRecords: inMemoryDb.studyRecords,
      savedWords: inMemoryDb.savedWords,
      customPassages: inMemoryDb.customPassages,
      updatedAt: inMemoryDb.updatedAt,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Profiles (Get & Create/Update)
app.get("/api/profiles", (req, res) => {
  res.json({ success: true, profiles: inMemoryDb.profiles });
});

app.post("/api/profiles", (req, res) => {
  try {
    const profile = req.body;
    if (!profile || !profile.name) {
      return res.status(400).json({ success: false, error: "프로필 이름이 필요합니다." });
    }

    const existingIndex = inMemoryDb.profiles.findIndex((p) => p.id === profile.id);
    if (existingIndex >= 0) {
      // Preserve admin status if modifying mom profile
      const isMom = inMemoryDb.profiles[existingIndex].isMomOrAdmin || inMemoryDb.profiles[existingIndex].name === "열공마미";
      inMemoryDb.profiles[existingIndex] = {
        ...inMemoryDb.profiles[existingIndex],
        ...profile,
        isMomOrAdmin: isMom || profile.isMomOrAdmin,
      };
    } else {
      const newProfile = {
        id: profile.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: profile.name.trim(),
        grade: profile.grade || "고3/수능",
        targetLevel: profile.targetLevel || "1등급 목표",
        avatarTheme: profile.avatarTheme || "spider-red",
        createdAt: profile.createdAt || new Date().toISOString(),
        isMomOrAdmin: profile.name === "열공마미" || profile.isMomOrAdmin === true,
        momEncouragement: profile.momEncouragement || null,
      };
      inMemoryDb.profiles.push(newProfile);
    }

    inMemoryDb.profiles = sanitizeProfiles(inMemoryDb.profiles);
    saveDatabaseToFile();
    res.json({ success: true, profiles: inMemoryDb.profiles });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Admin-Only Profile Deletion Endpoint
app.delete("/api/profiles/:id", (req, res) => {
  try {
    const profileId = req.params.id;
    const isAdmin = 
      req.headers["x-admin-key"] === "mom-admin" || 
      req.headers["x-is-admin"] === "true" ||
      req.query.isAdmin === "true";

    const targetProfile = inMemoryDb.profiles.find((p) => p.id === profileId);
    if (!targetProfile) {
      return res.json({ 
        success: true, 
        message: "이미 삭제되었거나 존재하지 않는 프로필입니다.", 
        profiles: inMemoryDb.profiles 
      });
    }

    // Protection 1: Admin profile cannot be deleted by anyone
    if (targetProfile.id === "user-mom" || targetProfile.name === "열공마미" || targetProfile.isMomOrAdmin) {
      return res.status(400).json({ success: false, error: "관리자(열공마미) 계정은 삭제할 수 없습니다." });
    }

    // Protection 2: Non-admin users cannot delete any profile
    if (!isAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: "학습자 삭제 권한이 없습니다. 등록된 학습자 삭제는 관리자(열공마미)만 수행할 수 있습니다." 
      });
    }

    // Delete profile and clean up associated records
    inMemoryDb.profiles = inMemoryDb.profiles.filter((p) => p.id !== profileId);
    inMemoryDb.studyRecords = inMemoryDb.studyRecords.filter((r) => r.userId !== profileId);
    inMemoryDb.savedWords = inMemoryDb.savedWords.filter((w) => w.userId !== profileId);

    saveDatabaseToFile();
    console.log(`[Admin Action] Deleted profile: ${targetProfile.name} (${profileId})`);

    res.json({
      success: true,
      message: `'${targetProfile.name}' 학습자 프로필이 삭제되었습니다.`,
      profiles: inMemoryDb.profiles,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Study Records Sync
app.get("/api/study-records", (req, res) => {
  const userId = req.query.userId as string;
  if (userId) {
    const filtered = inMemoryDb.studyRecords.filter((r) => r.userId === userId);
    return res.json({ success: true, studyRecords: filtered });
  }
  res.json({ success: true, studyRecords: inMemoryDb.studyRecords });
});

app.post("/api/study-records", (req, res) => {
  try {
    const record = req.body;
    if (!record || !record.userId) {
      return res.status(400).json({ success: false, error: "학습자 ID가 필요합니다." });
    }
    const recordId = record.id || `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newRecord = { ...record, id: recordId, createdAt: record.createdAt || new Date().toISOString() };
    
    // Check if duplicate
    const existsIdx = inMemoryDb.studyRecords.findIndex((r) => r.id === recordId);
    if (existsIdx >= 0) {
      inMemoryDb.studyRecords[existsIdx] = newRecord;
    } else {
      inMemoryDb.studyRecords.push(newRecord);
    }

    saveDatabaseToFile();
    res.json({ success: true, record: newRecord, studyRecords: inMemoryDb.studyRecords });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Admin Study Record Reset
app.post("/api/study-records/reset", (req, res) => {
  try {
    const isAdmin = 
      req.headers["x-admin-key"] === "mom-admin" || 
      req.headers["x-is-admin"] === "true" ||
      req.query.isAdmin === "true";

    if (!isAdmin) {
      return res.status(403).json({ success: false, error: "관리자만 기록을 초기화할 수 있습니다." });
    }

    const { targetLearnerId, resetRecords, resetWords, resetEncouragement } = req.body;

    if (targetLearnerId === "all") {
      if (resetRecords) inMemoryDb.studyRecords = [];
      if (resetWords) inMemoryDb.savedWords = [];
      if (resetEncouragement) {
        inMemoryDb.profiles.forEach((p) => {
          if (!p.isMomOrAdmin) p.momEncouragement = null;
        });
      }
    } else if (targetLearnerId) {
      if (resetRecords) inMemoryDb.studyRecords = inMemoryDb.studyRecords.filter((r) => r.userId !== targetLearnerId);
      if (resetWords) inMemoryDb.savedWords = inMemoryDb.savedWords.filter((w) => w.userId !== targetLearnerId);
      if (resetEncouragement) {
        const target = inMemoryDb.profiles.find((p) => p.id === targetLearnerId);
        if (target) target.momEncouragement = null;
      }
    }

    saveDatabaseToFile();
    res.json({ success: true, message: "학습 데이터가 초기화되었습니다." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Mom Encouragement Message & Stamp Sync
app.post("/api/mom-encouragements", (req, res) => {
  try {
    const { learnerId, message, stamp, momName } = req.body;
    if (!learnerId) {
      return res.status(400).json({ success: false, error: "학습자 ID가 필요합니다." });
    }

    const targetProfile = inMemoryDb.profiles.find((p) => p.id === learnerId);
    if (!targetProfile) {
      return res.status(404).json({ success: false, error: "해당 학습자를 찾을 수 없습니다." });
    }

    const enc = {
      id: `enc-${Date.now()}`,
      message: (message || "").trim(),
      stamp: stamp || "heart",
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      momName: momName || "열공마미",
    };

    targetProfile.momEncouragement = enc;
    saveDatabaseToFile();

    res.json({ success: true, profile: targetProfile, encouragement: enc });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Custom Passages Sync
app.post("/api/custom-passages", (req, res) => {
  try {
    const passage = req.body;
    if (!passage || !passage.id) {
      return res.status(400).json({ success: false, error: "유효한 지문 데이터가 필요합니다." });
    }
    const exists = inMemoryDb.customPassages.findIndex((p) => p.id === passage.id);
    if (exists >= 0) {
      inMemoryDb.customPassages[exists] = passage;
    } else {
      inMemoryDb.customPassages.unshift(passage);
    }
    saveDatabaseToFile();
    res.json({ success: true, customPassages: inMemoryDb.customPassages });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Saved Words Sync
app.post("/api/saved-words", (req, res) => {
  try {
    const word = req.body;
    if (!word || !word.word || !word.userId) {
      return res.status(400).json({ success: false, error: "단어 및 사용자 ID가 필요합니다." });
    }
    const idx = inMemoryDb.savedWords.findIndex((w) => w.userId === word.userId && w.word.toLowerCase() === word.word.toLowerCase());
    if (idx >= 0) {
      inMemoryDb.savedWords[idx] = { ...inMemoryDb.savedWords[idx], ...word };
    } else {
      inMemoryDb.savedWords.push(word);
    }
    saveDatabaseToFile();
    res.json({ success: true, savedWords: inMemoryDb.savedWords });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Vite middleware / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`English Reading App Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
