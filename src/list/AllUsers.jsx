import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    IconButton,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { SearchContext } from '../components/SearchContext';
import './AllUsers.css'; // Add a CSS file for custom styles
import EditUser from './EditUser';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState({});
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://hmb-cjz7.onrender.com/api/users');
        if (response.status === 200 && Array.isArray(response.data)) {
          setUsers(response.data);
          response.data.forEach(user => fetchUserBooking(user.regNo));
        } else {
          console.error('Unexpected API response:', response);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    const fetchUserBooking = async (regNo) => {
      try {
        const response = await axios.get(`https://hmb-cjz7.onrender.com/api/bookings/${regNo}`);
        if (response.status === 200 && response.data) {
          setUserBookings(prevBookings => ({
            ...prevBookings,
            [regNo]: response.data.roomNo,
          }));
        } else {
          console.error('Unexpected API response:', response);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setUserBookings(prevBookings => ({
            ...prevBookings,
            [regNo]: 'N/A',
          }));
        } else {
          console.error('Error fetching booking:', error);
        }
      }
    };

    fetchUsers();
  }, []);

  const handleModify = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the JWT in localStorage
        await axios.delete(`https://hmb-cjz7.onrender.com/api/users/${userToDelete._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(users.filter(user => user._id !== userToDelete._id));
        setUserToDelete(null);
        toast.success('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete the user.');
      } finally {
        setConfirmDialogOpen(false);
      }
    }
  };

  const handleCancelRoom = async (regNo) => {
    try {
      const response = await axios.delete(`https://hmb-cjz7.onrender.com/api/bookings/${regNo}`);
      if (response.status === 200) {
        setUserBookings(prevBookings => ({
          ...prevBookings,
          [regNo]: 'N/A',
        }));
        toast.success(`Booking and payment details for ${regNo} have been canceled.`);
      } else {
        console.error('Error canceling room:', response);
        toast.error('Failed to cancel the booking and payment details.');
      }
    } catch (error) {
      console.error('Error canceling room:', error);
      toast.error('Failed to cancel the booking and payment details.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleOpenConfirmDialog = (user) => {
    setUserToDelete(user);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter(user =>
    user.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${user.firstName} ${user.initial} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Users
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#3f51b5' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Serial No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reg No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Room No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Modify</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Delete</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cancel Room</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TransitionGroup component={null}>
              {Array.isArray(filteredUsers) && filteredUsers.map((user, index) => (
                <CSSTransition
                  key={user._id}
                  timeout={500}
                  classNames="fade"
                >
                  <TableRow sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.regNo}</TableCell>
                    <TableCell>{`${user.firstName} ${user.initial} ${user.lastName}`}</TableCell>
                    <TableCell>{userBookings[user.regNo] || 'N/A'}</TableCell>
                    <TableCell>
                      <Button
                        sx={{ margin: 1, borderRadius: 3 }}
                        variant="contained"
                        color="primary"
                        onClick={() => handleModify(user)}
                        startIcon={<EditIcon />}
                      >
                        Modify
                      </Button>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        sx={{ margin: 1, color: '#f44336' }}
                        onClick={() => handleOpenConfirmDialog(user)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Button
                        sx={{ margin: 1, borderRadius: 3 }}
                        variant="contained"
                        color="warning"
                        onClick={() => handleCancelRoom(user.regNo)}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </TableBody>
        </Table>
      </TableContainer>
      {selectedUser && (
        <EditUser
          open={open}
          handleClose={handleClose}
          user={selectedUser}
          setUsers={setUsers}
        />
      )}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default AllUsers;
