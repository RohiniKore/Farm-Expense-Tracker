import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem
} from '@mui/material';
import { useData } from '../../contexts/DataContext';
import { createYield, updateYield } from '../../services/api';

const units = ['kg', 'tons', 'bags', 'liters', 'units'];

const YieldForm = ({ open, onClose, yieldData }) => {
  const { refreshData } = useData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    crop: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: ''
  });

  useEffect(() => {
    if (yieldData) {
      setFormData({
        date: new Date(yieldData.date).toISOString().split('T')[0],
        crop: yieldData.crop,
        quantity: yieldData.quantity,
        unit: yieldData.unit,
        pricePerUnit: yieldData.pricePerUnit
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        crop: '',
        quantity: '',
        unit: 'kg',
        pricePerUnit: ''
      });
    }
  }, [yieldData, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (yieldData) {
        await updateYield(yieldData._id, formData);
      } else {
        await createYield(formData);
      }
      refreshData();
      onClose();
    } catch (error) {
      alert('Failed to save yield');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{yieldData ? 'Edit Yield' : 'Add Yield'}</DialogTitle>
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
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
              >
                {units.map((unit) => (
                  <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Price/Unit (₹)"
                type="number"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {yieldData ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default YieldForm;