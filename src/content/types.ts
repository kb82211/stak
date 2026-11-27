export type Category = 'fundamentals' | 'portfolio' | 'markets' | 'personal';

export type Choice = { id: string; text: string };

export type MatchPair = { term: string; definition: string };

export type Question =
  | {
      id: string;
      type: 'mcq' | 'boolean';
      prompt: string;
      choices: Choice[];
      answer: string;
      explanation: string;
    }
  | {
      id: string;
      type: 'match';
      prompt: string;
      pairs: MatchPair[];
      explanation: string;
    };

export type Lesson = {
  id: string;
  title: string;
  category: Category;
  minutes: number;
  premium: boolean;
  summary: string;
  sections: { heading: string; body: string; example?: string }[];
  scenario: Question;
  quiz: Question[];
  takeaways: string[];
  terms: string[];
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
};

export type CatalogAsset = {
  symbol: string;
  name: string;
  assetType: 'stock' | 'etf';
  sector: string;
  description: string;
};

export type AchievementDef = {
  id: string;
  title: string;
  description: string;
  xp: number;
};

export type ChallengeKind = 'knowledge' | 'portfolio' | 'literacy' | 'research' | 'scenario';

export type ChallengeDef = {
  id: string;
  type: ChallengeKind;
  variant: number;
  title: string;
  difficulty: 'Intro' | 'Practice' | 'Stretch';
  premium: boolean;
  minutes: number;
  instructions: string;
  explanation: string;
  symbol?: string;
  rules?: { minHoldings: number; minSectors: number; maxWeight: number; requireStockAndEtf?: boolean };
  questions: Question[];
};

export function mcq(
  id: string,
  prompt: string,
  choices: [string, string, string, string],
  answer: string,
  explanation: string,
): Question {
  return {
    id,
    type: 'mcq',
    prompt,
    choices: ['a', 'b', 'c', 'd'].map((key, index) => ({ id: key, text: choices[index] })),
    answer,
    explanation,
  };
}

export function booleanQuestion(id: string, prompt: string, answer: boolean, explanation: string): Question {
  return {
    id,
    type: 'boolean',
    prompt,
    choices: [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' },
    ],
    answer: answer ? 'true' : 'false',
    explanation,
  };
}

export function matchQuestion(id: string, prompt: string, pairs: MatchPair[], explanation: string): Question {
  return { id, type: 'match', prompt, pairs, explanation };
}

export function questionsFor(lesson: Lesson): Question[] {
  return [lesson.scenario, ...lesson.quiz];
}
