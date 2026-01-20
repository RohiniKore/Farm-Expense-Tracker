import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { useData } from '../../contexts/DataContext';
import MonthSelector from './MonthSelector';
import StatCard from './StatCard';
import ExpensesList from '../Expenses/ExpensesList';
import YieldsList from '../Yields/YieldsList';
import AnalysisView from '../Analysis/AnalysisView';
import GraphsView from '../Graphs/GraphsView';

const Dashboard = () => {
  const { totalExpenses, totalRevenue, netProfit } = useData();
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Farm Dashboard
        </Typography>
        <MonthSelector />
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Expenses"
            value={totalExpenses}
            color="#ef5350"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Revenue"
            value={totalRevenue}
            color="#42a5f5"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title={netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
            value={Math.abs(netProfit)}
            color={netProfit >= 0 ? '#66bb6a' : '#ef5350'}
          />
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
            {['Expenses', 'Yields', 'Analysis', 'Graphs'].map((tab, index) => (
              <Box
                key={tab}
                onClick={() => setActiveTab(index)}
                sx={{
                  cursor: 'pointer',
                  pb: 1,
                  px: 2,
                  borderBottom: activeTab === index ? 2 : 0,
                  borderColor: 'primary.main',
                  color: activeTab === index ? 'primary.main' : 'text.secondary',
                  fontWeight: activeTab === index ? 600 : 400
                }}
              >
                {tab}
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && <ExpensesList />}
          {activeTab === 1 && <YieldsList />}
          {activeTab === 2 && <AnalysisView />}
          {activeTab === 3 && <GraphsView />}
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;