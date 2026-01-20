import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Box, Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useData } from '../../contexts/DataContext';
import { deleteYield } from '../../services/api';
import YieldForm from './YieldForm';

const YieldsList = () => {
  const { yields, refreshData } = useData();
  const [openForm, setOpenForm] = useState(false);
  const [editingYield, setEditingYield] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this yield record?')) {
      try {
        await deleteYield(id);
        refreshData();
      } catch (error) {
        alert('Failed to delete yield');
      }
    }
  };

  const handleEdit = (yieldData) => {
    setEditingYield(yieldData);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingYield(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Yields</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          Add Yield
        </Button>
      </Box>

      {yields.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          No yield records for this month
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Crop</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price/Unit</TableCell>
                <TableCell align="right">Revenue</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {yields.map((yieldData) => (
                <TableRow key={yieldData._id}>
                  <TableCell>{new Date(yieldData.date).toLocaleDateString()}</TableCell>
                  <TableCell><strong>{yieldData.crop}</strong></TableCell>
                  <TableCell align="right">{yieldData.quantity} {yieldData.unit}</TableCell>
                  <TableCell align="right">₹{yieldData.pricePerUnit.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>
                    ₹{yieldData.totalRevenue.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEdit(yieldData)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(yieldData._id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <YieldForm
        open={openForm}
        onClose={handleFormClose}
        yieldData={editingYield}
      />
    </Box>
  );
};

export default YieldsList;