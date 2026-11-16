export type Locale = 'fr'|'en';
export type Exam = 'tage'|'gmat';
export type Game = 'code-logic'|'argument-lab'|'enough-info';
export type Level = 1|2|3|4|5;
export interface QuestionText {
  prompt: string;
  context?: string;
  choices?: string[];
  statements?: string[];
  explanation: string;
  hint: string;
}
export interface Question {
  id:string; exam:Exam; game:Game; competency:string; difficulty:Level;
  estimatedSeconds:number; correctAnswer:string; status:'pilot'|'reviewed';
  alignment:'warmup'|'skill-practice';
  content:Record<Locale,QuestionText>;
}
export interface SkillProgress {
  level:Level; streakCorrect:number; streakWrong:number; attempts:number; correct:number;
}
export interface Progress {
  version:1; skills:Record<string,SkillProgress>; totalAnswered:number; totalCorrect:number;
}
export interface Attempt {
  questionId:string; selected:string; correct:boolean; elapsedSeconds:number;
}
