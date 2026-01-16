
export interface Example {
  word: string;
  reading: string;
  mean: string;
}

export interface KanjiCard {
  id: number | string;
  kanji: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  examples: Example[];
}

export interface Deck {
  id: string;
  title: string;
  cards: KanjiCard[];
}

export interface UserProgress {
  [cardId: string]: number; // cardId to timestamp (next review time)
}

export type ViewState = 'home' | 'study';

export type FeedbackType = 'wrong' | 'hard' | 'easy' | null;
