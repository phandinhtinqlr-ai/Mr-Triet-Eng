export interface Word {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningVietnamese: string;
  exampleEnglish: string;
  exampleVietnamese: string;
  synonyms?: string[];
  antonyms?: string[];
  usageNote?: string;
  imageUrl: string;
  topic: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
}

export interface UserWordProgress {
  wordId: string;
  status: "new" | "learning" | "review" | "mastered";
  wrongCount: number;
  correctCount: number;
  isHardWord: boolean;
  lastReviewed?: string;
  nextReviewDate?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  level: string;
  dailyGoal: number;
  preferredTopics: string[];
  learningStreak: number;
  lastLoginDate: string;
  totalPoints: number;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  wordsLearned: number;
  quizScore: number;
  quizTotal: number;
  pointsEarned: number;
}

export interface AppState {
  user: UserProfile | null;
  progress: Record<string, UserWordProgress>;
  lastLessonDate: string | null;
  todayWords: string[]; // wordIds
  history: DailyActivity[];
  customVocabulary: Word[];
}
