import { achievements } from './achievements';
import { catalogAssets } from './assets';
import { challenges } from './challenges';
import { fundamentalLessons } from './lessons/fundamentals';
import { marketLessons } from './lessons/markets';
import { personalLessons } from './lessons/personal';
import { portfolioLessons } from './lessons/portfolio';
import { paths } from './paths';
import { questionsFor, type Lesson } from './types';
import { LESSON_XP } from '../domain/progress';

export const lessons: Lesson[] = [
  ...fundamentalLessons,
  ...portfolioLessons,
  ...marketLessons,
  ...personalLessons,
];

const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));

export function lessonById(id: string) {
  return lessonMap.get(id);
}

export function lessonsForPath(pathId: string) {
  const path = paths.find((item) => item.id === pathId);
  if (!path) return [];
  return path.lessonIds.map((id) => lessonById(id)).filter((lesson): lesson is Lesson => Boolean(lesson));
}

export { achievements, catalogAssets, challenges, paths, questionsFor, LESSON_XP };
