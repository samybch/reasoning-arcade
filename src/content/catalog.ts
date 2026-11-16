import data from './questions.json';
import type {Question} from '../engine/types';

// Single versioned source for all pilot questions, statically bundled by Next.js.
// Every external contribution must pass the schema validator and editorial review.
export function getQuestions():Question[] {
  return data as unknown as Question[];
}
