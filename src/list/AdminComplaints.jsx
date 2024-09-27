import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ComplaintsTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://hmb-cjz7.onrender.com/api/complaints', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        toast.error('Error fetching complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleMarkResolved = async (complaintId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://hmb-cjz7.onrender.com/api/complaints/${complaintId}`,
        { status: 'resolved' },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComplaints((prevComplaints) =>
        prevComplaints.map((comp) =>
          comp._id === complaintId ? { ...comp, status: response.data.status } : comp
        )
      );
      toast.success('Complaint marked as resolved');
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast.error('Error updating complaint status');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Complaints
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <ComplaintsTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#3f51b5' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}><strong>Registration Number</strong></TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}><strong>Room Number</strong></TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}><strong>Complaint</strong></TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}><strong>Status</strong></TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.length > 0 ? (
                  complaints.map((complaint) => (
                    <TableRow key={complaint._id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                      <TableCell>{complaint.regNo}</TableCell>
                      <TableCell>{complaint.roomNo}</TableCell>
                      <TableCell>{complaint.reason}</TableCell>
                      <TableCell>{complaint.status}</TableCell>
                      <TableCell>
                        {complaint.status === 'pending' ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleMarkResolved(complaint._id)}
                          >
                            Mark as Resolved
                          </Button>
                        ) : (
                          <CheckCircleIcon color="success" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No complaints found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ComplaintsTableContainer>
        </>
      )}
      <ToastContainer />
    </Box>
  );
};

export default AdminComplaints;
