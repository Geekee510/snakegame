import React from 'react';
import { Typography } from '@mui/material';
import GameCanvas from './components/GameCanvas';
import GameHeader from './components/GameHeader';
import GameOverDialog from './components/GameOverDialog';
import useSnakeGame from './hooks/useSnakeGame';
import './App.css';

export default function App() {
  const {
    snake,
    food,
    score,
    highScore,
    gameOver,
    paused,
    started,
    restart,
  } = useSnakeGame();

  const isNewHighScore = gameOver && score >= highScore && score > 0;

  return (
    <div className="game-container">
      <Typography
        variant="h4"
        sx={{
          fontWeight: 900,
          background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 2,
          mb: 1,
        }}
      >
        Snake Game
      </Typography>

      <GameHeader score={score} highScore={highScore} paused={paused} />

      <GameCanvas snake={snake} food={food} paused={paused} started={started} />

      <Typography className="touch-hint">
        Arrow Keys to Move - Space to Pause - Touch Support
      </Typography>

      <GameOverDialog
        open={gameOver}
        score={score}
        highScore={highScore}
        isNewHighScore={isNewHighScore}
        onRestart={restart}
      />
    </div>
  );
}