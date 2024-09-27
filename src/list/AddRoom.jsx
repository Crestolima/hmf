import {
    Box,
    Button,
    MenuItem,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../components/AuthContext'; // Adjust the path as necessary

const AddRoom = () => {
  const { authState } = useContext(AuthContext);
  const [roomNo, setRoomNo] = useState('');
  const [roomType, setRoomType] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('');
  const [floor, setFloor] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomData = {
      roomNo,
      roomType,
      roomCapacity,
      floor,
      price,
    };

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debugging line

      if (!token) {
        toast.error('No token found, please log in again.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post('https://hmb-cjz7.onrender.com/api/rooms', roomData, config);
      console.log(response.data);
      toast.success('Room added successfully!');
    } catch (error) {
      console.error('There was an error adding the room!', error);
      toast.error('Failed to add room!');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add Rooms
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Room No"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            required
          />
          <TextField
            select
            label="Room Type"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            required
          >
            <MenuItem value="Single,Non-Attached">Single,Non-Attached</MenuItem>
            <MenuItem value="Single,Attached">Single,Attached</MenuItem>
            <MenuItem value="Double,Non-Attached">Double,Non-Attached</MenuItem>
            <MenuItem value="Double,Attached">Double,Attached</MenuItem>
          </TextField>
          <TextField
            label="Room Capacity"
            type="number"
            value={roomCapacity}
            onChange={(e) => setRoomCapacity(e.target.value)}
            required
          />
          <TextField
            label="Floor"
            type="number"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            required
          />
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Register
          </Button>
        </Box>
      </form>
      {/* Toast Container */}
      <ToastContainer />
    </Paper>
  );
};

export default AddRoom;
