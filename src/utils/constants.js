export const CELL_SIZE = 20;
export const COLS = 25;
export const ROWS = 25;
export const CANVAS_WIDTH = COLS * CELL_SIZE;
export const CANVAS_HEIGHT = ROWS * CELL_SIZE;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 60;
export const SPEED_DECREMENT = 5;
export const SPEED_INCREASE_INTERVAL = 3;

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const COLORS = {
  GRID: "#1e293b",
  BACKGROUND: "#0f172a",
  SNAKE_HEAD: "#22d3ee",
  SNAKE_BODY: "#06b6d4",
  SNAKE_TAIL: "#0891b2",
  FOOD: "#f43f5e",
  FOOD_GLOW: "rgba(244, 63, 94, 0.3)",
};

export const HIGH_SCORE_KEY = "snake-game-high-score";