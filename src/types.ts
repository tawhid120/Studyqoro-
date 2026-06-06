/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Subject {
  BANGLA = "বাংলা",
  ENGLISH = "English",
  MATHEMATICS = "উচ্চতর গণিত",
  PHYSICS = "পদার্থবিজ্ঞান",
  CHEMISTRY = "রসায়ন",
  ICT = "আইসিটি",
  GENERAL_KNOWLEDGE = "সাধারণ জ্ঞান"
}

export interface Question {
  id: string;
  subject: Subject;
  chapter: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  district: string;
  points: number;
  avatarUrl: string;
  streak: number;
}

export interface ExamSession {
  id: string;
  subject: Subject;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  questions: Question[];
  score?: number;
  correctAnswers?: number;
  completedAt?: string;
}

export interface AIResponse {
  answer: string;
  suggestions?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  attachments?: { name: string; mimeType: string; previewUrl?: string }[];
}

export interface StudentStats {
  name: string;
  points: number;
  streak: number;
  level: number;
  rank: number;
  examsGiven: number;
  totalQuestionsSolved: number;
  plan: "Free" | "Pro";
  completedMilestones: string[];
  isGuest?: boolean;
}

export interface SubjectReport {
  subject: Subject;
  solvedCount: number;
  accuracy: number; // percentage
  unlockedPercentage: number; // percentage of chapter progress
}
