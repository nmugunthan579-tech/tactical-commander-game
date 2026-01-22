
export type BlockColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface Position {
  x: number;
  y: number;
}

export interface StrategicHint {
  target: Position;
  action: string;
  reasoning: string;
  confidence: number;
}

export interface GameState {
  grid: BlockColor[][];
  score: number;
  moves: number;
  lastHint?: StrategicHint;
  isAnalyzing: boolean;
  directive: string;
}

export const GRID_SIZE = 8;
export const COLORS: BlockColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];
