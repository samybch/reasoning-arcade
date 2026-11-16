export type Locale = 'fr'|'en';
export type Exam = 'tage'|'gmat';
export type Game = 'code-logic'|'argument-lab'|'enough-info'|'quant-lab';
export type Level = 1|2|3|4|5;
export interface QuestionText {
  prompt: string;
  context?: string;
  choices?: string[];
  statements?: string[];
  explanation: string;
  hint: string;
  reviewSteps?: [string,string,string]; // Statement (1), statement (2), combined verdict.
}
export interface Question {
  id:string; exam:Exam; game:Game; competency:string; difficulty:Level;
  estimatedSeconds:number; correctAnswer:string; status:'pilot'|'reviewed';
  alignment:'warmup'|'skill-practice';
  sufficiency?:{first:boolean;second:boolean;together:boolean}; // Proof flags for Data Sufficiency only.
  content:Record<Locale,QuestionText>;
}
export interface SkillProgress {
  level:Level; streakCorrect:number; streakWrong:number; attempts:number; correct:number;
}
export interface Progress {
  version:1; skills:Record<string,SkillProgress>; totalAnswered:number; totalCorrect:number;
  recentQuestionIds?:string[]; // Optional for backward compatibility with existing v1 progress.
  pendingReviewIds?:string[]; // Bounded IDs of missed pilot items to review; no accounts.
}
export interface Attempt {
  questionId:string; selected:string; correct:boolean; elapsedSeconds:number;
}
