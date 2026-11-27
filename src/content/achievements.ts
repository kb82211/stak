import type { AchievementDef } from './types';

export const achievements: AchievementDef[] = [
  { id: 'first-lesson', title: 'First lesson', description: 'Finish and pass your first lesson.', xp: 20 },
  { id: 'perfect-quiz', title: 'Perfect quiz', description: 'Answer every question correctly on a lesson.', xp: 25 },
  { id: 'streak-7', title: '7-day streak', description: 'Learn on seven days in a row.', xp: 40 },
  { id: 'streak-30', title: '30-day streak', description: 'Learn on thirty days in a row.', xp: 80 },
  { id: 'first-trade', title: 'First simulated trade', description: 'Record your first virtual buy or sell.', xp: 15 },
  { id: 'portfolio-explorer', title: 'Portfolio explorer', description: 'Open five different asset pages.', xp: 20 },
  { id: 'diversification', title: 'Diversification practice', description: 'Meet the portfolio challenge rules in the simulator.', xp: 40 },
  { id: 'lessons-30', title: '30 lessons', description: 'Pass thirty lessons.', xp: 60 },
  { id: 'knowledge-milestone', title: 'Knowledge milestone', description: 'Reach 500 XP from learning.', xp: 30 },
  { id: 'first-challenge', title: 'First challenge', description: 'Complete a daily challenge.', xp: 20 },
  { id: 'path-complete', title: 'Path complete', description: 'Pass every lesson in a learning path.', xp: 50 },
];
