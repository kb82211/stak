export const LEVELS = [
  { id: 1, name: 'Financial Beginner', minXp: 0 },
  { id: 2, name: 'Money Explorer', minXp: 150 },
  { id: 3, name: 'Market Student', minXp: 400 },
  { id: 4, name: 'Portfolio Builder', minXp: 800 },
  { id: 5, name: 'Investment Analyst', minXp: 1400 },
  { id: 6, name: 'Financial Strategist', minXp: 2200 },
] as const;

export const PASS_RATIO = 0.7;
export const LESSON_XP = 50;
export const PERFECT_BONUS_XP = 25;
export const CHALLENGE_XP = 60;
export const EXPLORE_XP = 10;
export const EXPLORE_DAILY_CAP = 3;
export const STARTING_CASH = 10_000;

export function levelForXp(xp: number) {
  let current: (typeof LEVELS)[number] = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level;
  }
  return current;
}

export function nextLevel(xp: number) {
  return LEVELS.find((level) => level.minXp > xp) ?? null;
}

export function lessonXpAward(score: number, total: number, alreadyCompleted: boolean) {
  if (alreadyCompleted || total <= 0) return 0;
  if (score / total < PASS_RATIO) return 0;
  return score === total ? LESSON_XP + PERFECT_BONUS_XP : LESSON_XP;
}

export function passedQuiz(score: number, total: number) {
  return total > 0 && score / total >= PASS_RATIO;
}
