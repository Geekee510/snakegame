import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ReplayIcon from '@mui/icons-material/Replay';

/**
 * 游戏结束弹窗组件
 * @param {object} props
 * @param {boolean} props.open - 是否显示弹窗
 * @param {number} props.score - 本局分数
 * @param {number} props.highScore - 最高分
 * @param {boolean} props.isNewHighScore - 是否刷新了最高分
 * @param {Function} props.onRestart - 重新开始回调
 */
export default function GameOverDialog({ open, score, highScore, isNewHighScore, onRestart }) {
  return (
    <Dialog
      open={open}
      onClose={onRestart}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #334155',
          borderRadius: 3,
          textAlign: 'center',
        },
      }}
    >
      <DialogTitle
        sx={{
          color: '#f43f5e',
          fontWeight: 800,
          fontSize: '1.8rem',
          pb: 0,
        }}
      >
        <SportsEsportsIcon sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle' }} />
        游戏结束
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {/* 分数展示 */}
        <Box
          sx={{
            my: 2,
            p: 3,
            borderRadius: 2,
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#22d3ee', mb: 1 }}>
            {score}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            本局得分
          </Typography>
        </Box>

        {/* 最高分 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <EmojiEventsIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
          <Typography variant="body1" sx={{ color: '#f59e0b', fontWeight: 600 }}>
            最高分: {highScore}
          </Typography>
        </Box>

        {/* 新纪录提示 */}
        {isNewHighScore && (
          <Typography
            variant="body2"
            sx={{
              color: '#f59e0b',
              fontWeight: 700,
              animation: 'pulse 1s ease-in-out infinite',
              mt: 1,
            }}
          >
            🎉 恭喜，新纪录！
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
        <Button
          onClick={onRestart}
          variant="contained"
          startIcon={<ReplayIcon />}
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
            color: '#0f172a',
            fontWeight: 700,
            borderRadius: 2,
            px: 4,
            py: 1.2,
            fontSize: '1rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
            },
          }}
        >
          再来一局
        </Button>
      </DialogActions>
    </Dialog>
  );
}
