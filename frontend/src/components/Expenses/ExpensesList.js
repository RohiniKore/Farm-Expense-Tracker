// ============================================
// frontend/src/components/Expenses/ExpensesList.js
// ============================================
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Box, Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useData } from '../../contexts/DataContext';
import { deleteExpense } from '../../services/api';
import ExpenseForm from './ExpenseForm';

const ExpensesList = () => {
  const { expenses, refreshData } = useData();
  const [openForm, setOpenForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        refreshData();
      } catch (error) {
        alert('Failed to delete expense');
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingExpense(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Expenses</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          Add Expense
        </Button>
      </Box>

      {expenses.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          No expenses recorded for this month
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Crop</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell><strong>{expense.crop}</strong></TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description || '-'}</TableCell>
                  <TableCell align="right">₹{expense.amount.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEdit(expense)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(expense._id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ExpenseForm
        open={openForm}
        onClose={handleFormClose}
        expense={editingExpense}
      />
    </Box>
  );
};

export default ExpensesList;