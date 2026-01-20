import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Box
} from '@mui/material';
import { useData } from '../../contexts/DataContext';

const AnalysisView = () => {
  const { expenses, yields } = useData();

  const cropAnalysis = {};

  expenses.forEach((exp) => {
    if (!cropAnalysis[exp.crop]) {
      cropAnalysis[exp.crop] = { crop: exp.crop, expenses: 0, revenue: 0, profit: 0 };
    }
    cropAnalysis[exp.crop].expenses += exp.amount;
  });

  yields.forEach((yld) => {
    if (!cropAnalysis[yld.crop]) {
      cropAnalysis[yld.crop] = { crop: yld.crop, expenses: 0, revenue: 0, profit: 0 };
    }
    cropAnalysis[yld.crop].revenue += yld.totalRevenue;
  });

  Object.values(cropAnalysis).forEach((crop) => {
    crop.profit = crop.revenue - crop.expenses;
    crop.margin = crop.revenue > 0 ? ((crop.profit / crop.revenue) * 100).toFixed(1) : 0;
  });

  const analysisData = Object.values(cropAnalysis);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Crop Profitability Analysis
      </Typography>
      {analysisData.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          No data available for analysis
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Crop</TableCell>
                <TableCell align="right">Expenses</TableCell>
                <TableCell align="right">Revenue</TableCell>
                <TableCell align="right">Profit</TableCell>
                <TableCell align="right">Margin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analysisData.map((crop) => (
                <TableRow key={crop.crop}>
                  <TableCell><strong>{crop.crop}</strong></TableCell>
                  <TableCell align="right" sx={{ color: 'error.main' }}>
                    ₹{crop.expenses.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'info.main' }}>
                    ₹{crop.revenue.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: crop.profit >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 600
                  }}>
                    ₹{crop.profit.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: crop.margin >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 600
                  }}>
                    {crop.margin}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AnalysisView;