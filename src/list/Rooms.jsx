import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button, IconButton, Modal,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [regNo, setRegNo] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('https://hmb-cjz7.onrender.com/api/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error('Failed to fetch rooms');
      }
    };
    fetchRooms();
  }, []);

  const handleBook = (room) => {
    setSelectedRoom(room);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRoom(null);
    setRegNo('');
    setAmount('');
  };

  const handleSubmit = async () => {
    if (!selectedRoom) return;

    try {
      const bookingPayload = {
        regNo,
        roomNo: selectedRoom.roomNo,
        dateOfBooking: new Date(),
        payment: amount
      };

      await axios.post('https://hmb-cjz7.onrender.com/api/bookings', bookingPayload);

      const paymentPayload = {
        roomNo: selectedRoom.roomNo,
        regNo,
        paidAmt: amount
      };

      await axios.post('https://hmb-cjz7.onrender.com/api/payDetails', paymentPayload);

      toast.success('Booking and payment processed successfully');
      handleClose();
    } catch (error) {
      console.error('Error processing booking:', error);
      toast.error('Failed to process booking');
    }
  };

  const handleDelete = async (roomId) => {
    try {
      await axios.delete(`https://hmb-cjz7.onrender.com/api/rooms/${roomId}`);
      setRooms(rooms.filter(room => room._id !== roomId));
      toast.success('Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };

  return (
    <div>
      <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <Table aria-label="Rooms Table">
          <TableHead sx={{ backgroundColor: '#3f51b5' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Serial No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Room No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Floor</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Room Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vacancy</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Book</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.length > 0 ? rooms.map((room, index) => (
              <TableRow key={room._id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{room.roomNo}</TableCell>
                <TableCell>{room.floor}</TableCell>
                <TableCell>{room.roomType}</TableCell>
                <TableCell>{room.roomCapacity}</TableCell>
                <TableCell>{room.price}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleBook(room)}>
                    Book
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleDelete(room._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No rooms available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Book Room {selectedRoom?.roomNo}
          </Typography>
          <TextField
            label="Registration Number"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth sx={{ mt: 2 }}>
            Confirm Booking
          </Button>
        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Rooms;
