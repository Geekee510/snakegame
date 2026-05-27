import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarsIcon from '@mui/icons-material/Stars';

/**
 * 顶部分数栏组件
 * @param {object} props
 * @param {number} props.score - 当前分数
 * @param {number} props.highScore - 最高分
 * @param {boolean} props.paused - 是否暂停
 */
export default function GameHeader({ score, highScore, paused }) {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 1.5,
        mb: 1,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
      }}
    >
      {/* 当前分数 */}
      <Chip
        icon={<StarsIcon sx={{ color: '#22d3ee !important' }} />}
        label={
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
            分数: {score}
          </Typography>
        }
        sx={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          px: 1,
        }}
      />

      {/* 暂停提示 */}
      {paused && (
        <Typography
          variant="body2"
          sx={{
            color: '#38bdf8',
            fontWeight: 600,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          已暂停
        </Typography>
      )}

      {/* 最高分 */}
      <Chip
        icon={<EmojiEventsIcon sx={{ color: '#f59e0b !important' }} />}
        label={
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
            最高: {highScore}
          </Typography>
        }
        sx={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          px: 1,
        }}
      />
    </Box>
  );
}
