import EditIcon from '@mui/icons-material/Edit';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import KeyIcon from '@mui/icons-material/Key';
import StorageIcon from '@mui/icons-material/Storage';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: '#fff',
  borderRadius: 10,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '150px',
  position: 'relative',
}));

const IconContainer = styled('div')({
  position: 'absolute',
  top: '10px',
  left: '10px',
  display: 'flex',
  alignItems: 'center',
});

const DataText = styled(Typography)(({ color }) => ({
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  fontSize: '24px',
  fontWeight: 'bold',
  color: color,
}));

const TitleText = styled(Typography)(({ color }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  fontSize: '14px',
  fontWeight: 'normal',
  color: color,
}));

const Dashboard = () => {
  const [data, setData] = useState({
    residence: 0,
    rooms: 0,
    totalCapacity: 0,
    vacancy: 0,
  });
  const [notBackYetData, setNotBackYetData] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({
    regNo: '',
    roomNo: '',
    paidAmt: '',
    newPaidAmt: '',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('https://hmb-cjz7.onrender.com/api/dashboard-data');
        setData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    const fetchNotBackYet = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://hmb-cjz7.onrender.com/api/not-returned-logs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotBackYetData(res.data);
      } catch (error) {
        console.error('Error fetching not-back-yet data:', error);
      }
    };

    const fetchPaymentDetails = async () => {
      try {
        const res = await axios.get('https://hmb-cjz7.onrender.com/api/payment-details');
        setPaymentDetails(res.data);
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    };

    fetchDashboardData();
    fetchNotBackYet();
    fetchPaymentDetails();
  }, []);

  const handleEditClick = (payment) => {
    setCurrentPayment({
      regNo: payment.regNo,
      roomNo: payment.roomNo,
      paidAmt: payment.paidAmt,
      newPaidAmt: '',
    });
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentPayment({
      regNo: '',
      roomNo: '',
      paidAmt: '',
      newPaidAmt: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePayment = async () => {
    try {
      const updatedPaidAmt =
        (parseFloat(currentPayment.paidAmt) || 0) +
        parseFloat(currentPayment.newPaidAmt || 0);
      const paymentDetail = paymentDetails.find(
        (payment) => payment.regNo === currentPayment.regNo
      );
      const totalAmount = paymentDetail?.totalAmt || 0;

      if (updatedPaidAmt > totalAmount) {
        toast.error('Paid amount exceeds the total amount.');
        return;
      }

      const newDueAmt = Math.max(0, totalAmount - updatedPaidAmt);

      const payload = { newPaidAmt: currentPayment.newPaidAmt };

      await axios.put(
        `https://hmb-cjz7.onrender.com/api/payment-details/${currentPayment.regNo}`,
        payload
      );
      setPaymentDetails((prev) =>
        prev.map((payment) =>
          payment.regNo === currentPayment.regNo
            ? { ...payment, paidAmt: updatedPaidAmt, dueAmt: newDueAmt }
            : payment
        )
      );
      setEditDialogOpen(false);
      toast.success('Payment details updated successfully!');
    } catch (error) {
      console.error('Error updating payment details:', error);
      toast.error('Failed to update payment details.');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <GroupAddIcon fontSize="large" style={{ fontSize: 40, color: '#f44336' }} />
            </IconContainer>
            <TitleText variant="subtitle1" color="#f44336">
              Residence
            </TitleText>
            <DataText variant="h4" color="#f44336">
              {data.residence}
            </DataText>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <KeyIcon fontSize="large" style={{ fontSize: 40, color: '#2196f3' }} />
            </IconContainer>
            <TitleText variant="subtitle1" color="#2196f3">
              Rooms
            </TitleText>
            <DataText variant="h4" color="#2196f3">
              {data.rooms}
            </DataText>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <StorageIcon fontSize="large" style={{ fontSize: 40, color: '#4caf50' }} />
            </IconContainer>
            <TitleText variant="subtitle1" color="#4caf50">
              Total Capacity
            </TitleText>
            <DataText variant="h4" color="#4caf50">
              {data.totalCapacity}
            </DataText>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <HourglassEmptyIcon fontSize="large" style={{ fontSize: 40, color: '#ff9800' }} />
            </IconContainer>
            <TitleText variant="subtitle1" color="#ff9800">
              Vacancy
            </TitleText>
            <DataText variant="h4" color="#ff9800">
              {data.vacancy}
            </DataText>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Not Back Yet Table */}
      <Typography variant="h5" gutterBottom>
        Not Back Yet
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="not back yet table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#3f51b5' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reg No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Room No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Out Date & Time
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notBackYetData.length > 0 ? (
              notBackYetData.map((log) => (
                <TableRow
                  key={log._id}
                  sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <TableCell>{log.regNo}</TableCell>
                  <TableCell>{log.roomNo}</TableCell>
                  <TableCell>
                    {format(new Date(log.outTime), 'MM/dd/yyyy hh:mm a')}
                  </TableCell>
                  <TableCell>{log.remarks}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  All residents have returned.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Due Payments Table */}
      <Typography variant="h5" gutterBottom>
        Due Payments
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="due payments table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#3f51b5' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reg No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Room No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Total Amount
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Paid Amount
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Due Amount</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentDetails.length > 0 ? (
              paymentDetails.map((payment) => (
                <TableRow
                  key={payment.regNo}
                  sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <TableCell>{payment.regNo}</TableCell>
                  <TableCell>{payment.roomNo}</TableCell>
                  <TableCell>{payment.totalAmt}</TableCell>
                  <TableCell>{payment.paidAmt}</TableCell>
                  <TableCell>{payment.dueAmt}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(payment)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Due Payments Available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Payment Dialog */}
      <Dialog open={editDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Registration No"
            type="text"
            fullWidth
            value={currentPayment.regNo}
            disabled
          />
          <TextField
            margin="dense"
            label="Room No"
            type="text"
            fullWidth
            value={currentPayment.roomNo}
            disabled
          />
          <TextField
            margin="dense"
            label="Total Amount"
            type="number"
            fullWidth
            value={
              paymentDetails.find(
                (payment) => payment.regNo === currentPayment.regNo
              )?.totalAmt || 0
            }
            disabled
          />
          <TextField
            margin="dense"
            label="Paid Amount"
            type="number"
            fullWidth
            value={currentPayment.paidAmt}
            disabled
          />
          <TextField
            margin="dense"
            label="New Amount Paid"
            type="number"
            name="newPaidAmt"
            fullWidth
            value={currentPayment.newPaidAmt}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdatePayment} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default Dashboard;
