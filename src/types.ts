import { Timestamp } from 'firebase/firestore';

export interface Profile {
  id: string;
  username: string;
  email: string;
  points: number;
  lives: number;
  lastLifeUpdate: number;
  isAdmin: boolean;
  createdAt: number;
  isGuest?: boolean;
  avatarUrl?: string;
  bio?: string;
  stats?: {
    totalAnswers: number;
    correctAnswers: number;
    level: number;
    exp: number;
    dailyStreak: number;
    lastDailyChallenge?: number;
  };
  lifelines?: {
    fiftyFifty: number;
    skip: number;
    extraTime: number;
  };
  inventory?: {
    avatars: string[];
    themes: string[];
  };
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple' | 'boolean' | 'text';

export interface Question {
  id: string;
  category: string;
  difficulty: Difficulty;
  type: QuestionType;
  questionText: string;
  correctAnswer: string;
  options?: string[];
  explanation?: string;
  createdAt: number;
}

export interface HistoryRecord {
  id: string;
  userId: string;
  questionId: string;
  isCorrect: boolean;
  answeredAt: number;
}
