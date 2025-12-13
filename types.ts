
export enum ViewState {
  HOME = 'HOME',
  PRACTICE = 'PRACTICE',
  VIDEO = 'VIDEO',
  SELF_CHECK = 'SELF_CHECK',
  GAME = 'GAME',
  STATS = 'STATS',
}

export interface UserProfile {
  schoolName: string;
  studentId: string;
  name: string;
}

export interface NursingSkill {
  id: string;
  title: string;
  description: string;
  steps: SkillStep[];
  requiredItems: string[];
}

export interface SkillStep {
  id: number;
  instruction: string;
  explanation?: string; // Additional info for "With Explanation" mode
  imageUrl?: string;
  isCritical: boolean;
}

export interface AssessmentRecord {
  id: string;
  date: string;
  score: number;
  passed: boolean;
  type: 'SELF_CHECK' | 'GAME_ITEM' | 'GAME_ORDER';
  skillTitle: string;
}

export enum EvaluationStatus {
  COMPLETE = 2,
  PARTIAL = 1,
  NOT_DONE = 0,
}

export interface GameItem {
  id: string;
  name: string;
  isCorrect: boolean;
  icon: string;
}
