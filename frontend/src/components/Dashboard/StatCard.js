import React from 'react';
import { Paper, Typography } from '@mui/material'; // Removed unused 'Box' import

const StatCard = ({ title, value, color }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`
      }}
    >
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, color }}>
        ₹{value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Typography>
    </Paper>
  );
};

export default StatCard;