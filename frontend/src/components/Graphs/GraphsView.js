import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useData } from '../../contexts/DataContext';

const COLORS = ['#ef5350', '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#26c6da'];

const GraphsView = () => {
  const { expenses, yields } = useData();

  // Expenses by category
  const categoryData = {};
  expenses.forEach((exp) => {
    categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;
  });
  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  // Expenses over time
  const timeData = {};
  expenses.forEach((exp) => {
    const date = new Date(exp.date).toISOString().split('T')[0];
    timeData[date] = (timeData[date] || 0) + exp.amount;
  });
  const timeChartData = Object.entries(timeData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date, amount }));

  // Crop comparison
  const cropData = {};
  expenses.forEach((exp) => {
    if (!cropData[exp.crop]) cropData[exp.crop] = { crop: exp.crop, expenses: 0, revenue: 0 };
    cropData[exp.crop].expenses += exp.amount;
  });
  yields.forEach((yld) => {
    if (!cropData[yld.crop]) cropData[yld.crop] = { crop: yld.crop, expenses: 0, revenue: 0 };
    cropData[yld.crop].revenue += yld.totalRevenue;
  });
  const cropChartData = Object.values(cropData);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Financial Graphs
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Expenses by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Expenses Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#ef5350" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Crop Comparison
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="expenses" fill="#ef5350" />
                <Bar dataKey="revenue" fill="#42a5f5" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GraphsView;