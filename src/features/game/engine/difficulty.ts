export type Difficulty = 'beginner' | 'intermediate' | 'hard' | 'expert';

export const difficultyConfig: Record<
  Difficulty,
  { minClues: number; maxClues: number; label: string }
> = {
  beginner: { minClues: 40, maxClues: 45, label: 'Beginner' },
  intermediate: { minClues: 32, maxClues: 38, label: 'Intermediate' },
  hard: { minClues: 26, maxClues: 31, label: 'Hard' },
  expert: { minClues: 22, maxClues: 25, label: 'Expert' },
};
