export type CategoryType = 'science' | 'humanities' | 'social' | 'tech' | 'psychology' | 'art' | 'economy';

export type GradeType = '초등 고학년' | '중1' | '중2' | '중3' | '고1' | '고2' | '고3/수능' | 'N수/심화';

export type DifficultyType = '기초 (Easy)' | '기본 (Standard)' | '실전 (Hard)' | '킬러/1등급 (Killer)';

export type LevelType = '고1 기초' | '고2 실력' | '고3/수능 실전' | '수능 고난도 킬러' | string;

export type SpiderSuitTheme = 
  | 'spider-red' 
  | 'spider-black' 
  | 'spider-gold' 
  | 'spider-blue' 
  | 'spider-pink' 
  | 'spider-purple' 
  | 'spider-green';

export interface MomEncouragement {
  id: string;
  message: string;
  stamp: 'king' | 'heart' | 'star' | 'fire' | 'trophy' | 'spider';
  date: string;
  createdAt: string;
  momName: string;
}

export interface UserProfile {
  id: string;
  name: string;
  grade: GradeType | string;
  targetLevel: string; // e.g. '1등급 목표', '2등급 목표'
  avatarTheme: SpiderSuitTheme;
  createdAt: string;
  isMomOrAdmin?: boolean;
  momEncouragement?: MomEncouragement;
}

export interface Chunk {
  chunkEn: string;
  chunkKo: string;
}

export interface SentenceBreakdown {
  sentenceEn: string;
  chunks: Chunk[];
  grammarTip?: string;
}

export interface Paragraph {
  paragraphNumber: number;
  textEn: string;
  textKo: string;
  sentenceBreakdown: SentenceBreakdown[];
}

export interface VocabularyItem {
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  meaningKo: string;
  exampleEn: string;
  exampleKo: string;
  synonyms?: string[];
  csatImportance: '⭐⭐⭐ (필수)' | '⭐⭐ (빈출)' | '⭐ (심화)' | string;
}

export interface QuestionOption {
  num: number;
  text: string;
}

export interface Question {
  id: string;
  type: string;
  questionEn: string;
  questionKo: string;
  options: QuestionOption[];
  correctAnswer: number;
  explanation: string;
  tip: string;
}

export interface WritingTask {
  prompt: string;
  guide: string;
  modelAnswer: string;
}

export interface Passage {
  id: string;
  title: string;
  titleKo: string;
  category: CategoryType | string;
  level: LevelType | string;
  wordCount: number;
  readTimeMinutes: number;
  source: string;
  backgroundKnowledge: string;
  paragraphs: Paragraph[];
  vocabulary: VocabularyItem[];
  questions: Question[];
  writingOrSummaryTask: WritingTask;
  createdAt: string;
  isCustomAi?: boolean;
}

export interface SavedWord {
  id: string;
  userId?: string;
  word: string;
  phonetic?: string;
  meaningKo: string;
  partOfSpeech: string;
  exampleEn: string;
  exampleKo: string;
  status: 'learning' | 'memorized';
  savedAt: string;
  passageId: string;
  passageTitle: string;
  reviewCount: number;
}

export interface StudyRecord {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  passageId: string;
  passageTitle: string;
  category: string;
  level: string;
  score: number; // percentage (0 - 100)
  correctAnswers: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  memorizedWords: number;
  summaryAnswer?: string;
  completedAt: string;
}

export interface SentenceAnalysisResult {
  subject: string;
  predicate: string;
  modifiers?: string[];
  clauses?: string[];
  chunks: { en: string; ko: string }[];
  grammarPoint: string;
  koreanTranslation: string;
  studyTip: string;
}

export type TabType = 'reading' | 'practice' | 'vocab' | 'analytics';
export type ActiveTab = TabType;

export type ReadingDisplayMode = 'standard' | 'chunking' | 'bilingual' | 'syntax';

export interface PrintSettings {
  includeHeader: boolean;
  studentName: string;
  studyDate: string;
  includeBackground: boolean;
  includePassage: boolean;
  includeQuestions: boolean;
  includeVocabList: boolean;
  includeVocabQuiz: boolean;
  includeAnswerKey: boolean;
  includeFullTranslation: boolean;
  includeWritingTask: boolean;
  fontSize: 'sm' | 'base' | 'lg';
  layoutType: 'worksheet' | 'vocab-only' | 'answers-only' | 'all-in-one';
}
