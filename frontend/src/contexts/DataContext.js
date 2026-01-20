import React, { createContext, useState, useContext, useEffect } from 'react';
import { getExpenses, getYields } from '../services/api';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

export const DataProvider = ({ children }) => {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [yields, setYields] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [loading, setLoading] = useState(false);

  const loadData = async (month = selectedMonth) => {
    if (!token) return;
    
    setLoading(true);
    try {
      const [expensesRes, yieldsRes] = await Promise.all([
        getExpenses(month),
        getYields(month)
      ]);
      setExpenses(expensesRes.data);
      setYields(yieldsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, selectedMonth]);

  const refreshData = () => loadData(selectedMonth);

  const changeMonth = (month) => {
    setSelectedMonth(month);
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenue = yields.reduce((sum, y) => sum + y.totalRevenue, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <DataContext.Provider value={{
      expenses,
      yields,
      selectedMonth,
      loading,
      totalExpenses,
      totalRevenue,
      netProfit,
      refreshData,
      changeMonth
    }}>
      {children}
    </DataContext.Provider>
  );
};