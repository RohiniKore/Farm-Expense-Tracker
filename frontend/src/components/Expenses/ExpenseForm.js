import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem
} from '@mui/material';
import { useData } from '../../contexts/DataContext';
import { createExpense, updateExpense } from '../../services/api';

const categories = ['Seeds', 'Fertilizers', 'Pesticides', 'Fuel', 'Labor', 'Equipment', 'Water', 'Other'];

const ExpenseForm = ({ open, onClose, expense }) => {
  const { refreshData } = useData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    crop: '',
    category: 'Seeds',
    description: '',
    amount: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        date: new Date(expense.date).toISOString().split('T')[0],
        crop: expense.crop,
        category: expense.category,
        description: expense.description || '',
        amount: expense.amount
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        crop: '',
        category: 'Seeds',
        description: '',
        amount: ''
      });
    }
  }, [expense, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (expense) {
        await updateExpense(expense._id, formData);
      } else {
        await createExpense(formData);
      }
      refreshData();
      onClose();
    } catch (error) {
      alert('Failed to save expense');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{expense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Crop"
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount (₹)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {expense ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExpenseForm;