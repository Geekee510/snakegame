import { useCallback, useEffect, useRef, useState } from 'react';
import {
  COLS,
  ROWS,
  INITIAL_SPEED,
  MIN_SPEED,
  SPEED_DECREMENT,
  SPEED_INCREASE_INTERVAL,
  DIRECTIONS,
  HIGH_SCORE_KEY,
} from '../utils/constants';

/**
 * 生成随机食物位置
 * @param {Array<{x: number, y: number}>} snake - 蛇身体坐标数组
 * @returns {{x: number, y: number}} 食物坐标
 */
function generateFood(snake) {
  let food;
  do {
    food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
  return food;
}

/**
 * 获取初始蛇身
 * @returns {Array<{x: number, y: number}>}
 */
function getInitialSnake() {
  const centerX = Math.floor(COLS / 2);
  const centerY = Math.floor(ROWS / 2);
  return [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY },
  ];
}

/**
 * 计算当前速度
 * @param {number} score - 当前分数
 * @returns {number} 移动间隔（毫秒）
 */
function calculateSpeed(score) {
  const decrements = Math.floor(score / SPEED_INCREASE_INTERVAL);
  const speed = INITIAL_SPEED - decrements * SPEED_DECREMENT;
  return Math.max(speed, MIN_SPEED);
}

/**
 * 蛇游戏核心逻辑 Hook
 * @returns {object} 游戏状态和控制方法
 */
export default function useSnakeGame() {
  /** 蛇身体坐标 */
  const [snake, setSnake] = useState(getInitialSnake);
  /** 食物坐标 */
  const [food, setFood] = useState(() => generateFood(getInitialSnake()));
  /** 方向 */
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  /** 分数 */
  const [score, setScore] = useState(0);
  /** 最高分 */
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  /** 游戏是否结束 */
  const [gameOver, setGameOver] = useState(false);
  /** 游戏是否暂停 */
  const [paused, setPaused] = useState(false);
  /** 游戏是否已开始 */
  const [started, setStarted] = useState(false);

  // 使用 ref 存储最新状态以避免闭包问题
  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const scoreRef = useRef(score);
  const gameOverRef = useRef(gameOver);
  const pausedRef = useRef(paused);
  const startedRef = useRef(started);

  // 同步 ref
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  /** 游戏主循环定时器 ID */
  const timerRef = useRef(null);

  /**
   * 游戏主循环：移动蛇、检测碰撞、更新状态
   */
  const gameStep = useCallback(() => {
    if (gameOverRef.current || pausedRef.current || !startedRef.current) {
      return;
    }

    const currentSnake = snakeRef.current;
    const currentDirection = directionRef.current;
    const currentFood = foodRef.current;

    // 计算新蛇头位置
    const head = currentSnake[0];
    const newHead = {
      x: head.x + currentDirection.x,
      y: head.y + currentDirection.y,
    };

    // 碰撞检测：撞墙
    if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
      setGameOver(true);
      // 更新最高分
      const currentScore = scoreRef.current;
      const currentHigh = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
      if (currentScore > currentHigh) {
        localStorage.setItem(HIGH_SCORE_KEY, String(currentScore));
        setHighScore(currentScore);
      }
      return;
    }

    // 碰撞检测：撞自己
    if (currentSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      const currentScore = scoreRef.current;
      const currentHigh = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
      if (currentScore > currentHigh) {
        localStorage.setItem(HIGH_SCORE_KEY, String(currentScore));
        setHighScore(currentScore);
      }
      return;
    }

    // 判断是否吃到食物
    const ateFood = newHead.x === currentFood.x && newHead.y === currentFood.y;

    // 构建新蛇身
    let newSnake;
    if (ateFood) {
      // 吃到食物：蛇身加长，分数增加
      newSnake = [newHead, ...currentSnake];
      const newScore = scoreRef.current + 1;
      setScore(newScore);
      setFood(generateFood(newSnake));
    } else {
      // 未吃到食物：蛇身长度不变，去掉尾巴
      newSnake = [newHead, ...currentSnake.slice(0, -1)];
    }

    setSnake(newSnake);
  }, []);

  /**
   * 启动/重启游戏循环
   */
  const startGameLoop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const speed = calculateSpeed(scoreRef.current);
    timerRef.current = setInterval(gameStep, speed);
  }, [gameStep]);

  /**
   * 速度变化时重启游戏循环
   */
  useEffect(() => {
    if (started && !gameOver && !paused) {
      startGameLoop();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [score, started, gameOver, paused, startGameLoop]);

  /**
   * 键盘事件处理
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 阻止方向键滚动页面
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // 空格键暂停/继续
      if (e.key === ' ') {
        if (gameOverRef.current) return;
        if (!startedRef.current) {
          setStarted(true);
          return;
        }
        setPaused((prev) => !prev);
        return;
      }

      // 方向控制
      const currentDir = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
          if (currentDir !== DIRECTIONS.DOWN) {
            setDirection(DIRECTIONS.UP);
          }
          break;
        case 'ArrowDown':
          if (currentDir !== DIRECTIONS.UP) {
            setDirection(DIRECTIONS.DOWN);
          }
          break;
        case 'ArrowLeft':
          if (currentDir !== DIRECTIONS.RIGHT) {
            setDirection(DIRECTIONS.LEFT);
          }
          break;
        case 'ArrowRight':
          if (currentDir !== DIRECTIONS.LEFT) {
            setDirection(DIRECTIONS.RIGHT);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * 触摸滑动控制
   */
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // 最小滑动距离
      if (Math.max(absDx, absDy) < 30) return;

      const currentDir = directionRef.current;

      if (absDx > absDy) {
        // 水平滑动
        if (dx > 0 && currentDir !== DIRECTIONS.LEFT) {
          setDirection(DIRECTIONS.RIGHT);
        } else if (dx < 0 && currentDir !== DIRECTIONS.RIGHT) {
          setDirection(DIRECTIONS.LEFT);
        }
      } else {
        // 垂直滑动
        if (dy > 0 && currentDir !== DIRECTIONS.UP) {
          setDirection(DIRECTIONS.DOWN);
        } else if (dy < 0 && currentDir !== DIRECTIONS.DOWN) {
          setDirection(DIRECTIONS.UP);
        }
      }

      // 如果游戏未开始，触摸滑动也启动游戏
      if (!startedRef.current) {
        setStarted(true);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  /**
   * 重新开始游戏
   */
  const restart = useCallback(() => {
    const initialSnake = getInitialSnake();
    const newFood = generateFood(initialSnake);
    setSnake(initialSnake);
    setFood(newFood);
    setDirection(DIRECTIONS.RIGHT);
    setScore(0);
    setGameOver(false);
    setPaused(false);
    setStarted(true);
    // 重置 ref
    directionRef.current = DIRECTIONS.RIGHT;
    snakeRef.current = initialSnake;
    foodRef.current = newFood;
    scoreRef.current = 0;
    gameOverRef.current = false;
    pausedRef.current = false;
    startedRef.current = true;
  }, []);

  /**
   * 开始游戏（首次）
   */
  const startGame = useCallback(() => {
    setStarted(true);
  }, []);

  /**
   * 切换暂停状态
   */
  const togglePause = useCallback(() => {
    if (gameOverRef.current || !startedRef.current) return;
    setPaused((prev) => !prev);
  }, []);

  return {
    snake,
    food,
    direction,
    score,
    highScore,
    gameOver,
    paused,
    started,
    restart,
    startGame,
    togglePause,
  };
}
