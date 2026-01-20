import React from 'react';
import { Box, TextField } from '@mui/material';
import { useData } from '../../contexts/DataContext';

const MonthSelector = () => {
  const { selectedMonth, changeMonth } = useData();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <TextField
        label="Select Month"
        type="month"
        value={selectedMonth}
        onChange={(e) => changeMonth(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 200 }}
      />
    </Box>
  );
};

export default MonthSelector;

