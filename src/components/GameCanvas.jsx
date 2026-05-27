import React, { useEffect, useRef } from 'react';
import {
  CELL_SIZE,
  COLS,
  ROWS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  COLORS,
} from '../utils/constants';

/**
 * Canvas 游戏主组件
 * 负责绘制游戏画面：网格、蛇、食物
 * @param {object} props
 * @param {Array<{x: number, y: number}>} props.snake - 蛇身体坐标
 * @param {{x: number, y: number}} props.food - 食物坐标
 * @param {boolean} props.paused - 是否暂停
 * @param {boolean} props.started - 是否已开始
 */
export default function GameCanvas({ snake, food, paused, started }) {
  const canvasRef = useRef(null);

  /**
   * 绘制游戏画面
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 清空画布
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 绘制网格
    ctx.strokeStyle = COLORS.GRID;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(CANVAS_WIDTH, y * CELL_SIZE);
      ctx.stroke();
    }

    // 绘制食物光晕
    const foodCenterX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const foodCenterY = food.y * CELL_SIZE + CELL_SIZE / 2;
    const glowRadius = CELL_SIZE * 1.5;
    const glowGradient = ctx.createRadialGradient(
      foodCenterX, foodCenterY, 0,
      foodCenterX, foodCenterY, glowRadius
    );
    glowGradient.addColorStop(0, COLORS.FOOD_GLOW);
    glowGradient.addColorStop(1, 'rgba(244, 63, 94, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(
      foodCenterX - glowRadius,
      foodCenterY - glowRadius,
      glowRadius * 2,
      glowRadius * 2
    );

    // 绘制食物
    const foodPadding = 2;
    ctx.fillStyle = COLORS.FOOD;
    ctx.beginPath();
    const foodRadius = (CELL_SIZE - foodPadding * 2) / 2;
    ctx.arc(foodCenterX, foodCenterY, foodRadius, 0, Math.PI * 2);
    ctx.fill();

    // 食物高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(foodCenterX - 2, foodCenterY - 2, foodRadius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // 绘制蛇
    snake.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;
      const padding = 1;
      const size = CELL_SIZE - padding * 2;

      if (index === 0) {
        // 蛇头 - 特殊样式
        ctx.fillStyle = COLORS.SNAKE_HEAD;

        // 蛇头圆角矩形
        const headRadius = 4;
        ctx.beginPath();
        ctx.moveTo(x + padding + headRadius, y + padding);
        ctx.lineTo(x + padding + size - headRadius, y + padding);
        ctx.quadraticCurveTo(x + padding + size, y + padding, x + padding + size, y + padding + headRadius);
        ctx.lineTo(x + padding + size, y + padding + size - headRadius);
        ctx.quadraticCurveTo(x + padding + size, y + padding + size, x + padding + size - headRadius, y + padding + size);
        ctx.lineTo(x + padding + headRadius, y + padding + size);
        ctx.quadraticCurveTo(x + padding, y + padding + size, x + padding, y + padding + size - headRadius);
        ctx.lineTo(x + padding, y + padding + headRadius);
        ctx.quadraticCurveTo(x + padding, y + padding, x + padding + headRadius, y + padding);
        ctx.closePath();
        ctx.fill();

        // 蛇头发光效果
        ctx.shadowColor = COLORS.SNAKE_HEAD;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // 蛇眼
        const eyeSize = 3;
        const centerX = x + CELL_SIZE / 2;
        const centerY = y + CELL_SIZE / 2;
        ctx.fillStyle = '#0f172a';

        // 根据蛇的方向绘制眼睛位置
        ctx.beginPath();
        ctx.arc(centerX - 4, centerY - 3, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 4, centerY - 3, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // 眼睛高光
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX - 3, centerY - 4, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 5, centerY - 4, 1.2, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // 蛇身 - 渐变颜色
        const ratio = index / snake.length;
        const r = Math.round(6 + (8 - 6) * ratio);
        const g = Math.round(182 + (145 - 182) * ratio);
        const b = Math.round(212 + (178 - 212) * ratio);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

        const bodyRadius = 3;
        ctx.beginPath();
        ctx.moveTo(x + padding + bodyRadius, y + padding);
        ctx.lineTo(x + padding + size - bodyRadius, y + padding);
        ctx.quadraticCurveTo(x + padding + size, y + padding, x + padding + size, y + padding + bodyRadius);
        ctx.lineTo(x + padding + size, y + padding + size - bodyRadius);
        ctx.quadraticCurveTo(x + padding + size, y + padding + size, x + padding + size - bodyRadius, y + padding + size);
        ctx.lineTo(x + padding + bodyRadius, y + padding + size);
        ctx.quadraticCurveTo(x + padding, y + padding + size, x + padding, y + padding + size - bodyRadius);
        ctx.lineTo(x + padding, y + padding + bodyRadius);
        ctx.quadraticCurveTo(x + padding, y + padding, x + padding + bodyRadius, y + padding);
        ctx.closePath();
        ctx.fill();
      }
    });

    // 未开始提示
    if (!started) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('按方向键或空格开始游戏', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 15);

      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText('方向键控制移动 · 空格键暂停', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }
  }, [snake, food, started]);

  return (
    <div className="game-canvas-wrapper" style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ display: 'block' }}
      />
      {/* 暂停遮罩 */}
      {paused && started && (
        <div className="paused-overlay">
          <span className="paused-text">暂 停</span>
        </div>
      )}
    </div>
  );
}
