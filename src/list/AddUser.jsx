import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../components/AuthContext'; // Adjust the path as necessary

const AddUser = () => {
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    console.log('AuthState:', authState); // Debugging line
  }, [authState]);

  const initialFormState = {
    firstName: '',
    initial: '',
    lastName: '',
    phoneNo: '',
    email: '',
    dateOfBirth: '',
    course: '',
    year: '',
    dateOfJoining: '',
    address: '',
    gender: '',
    regNo: '',
    password: '',
    role: 'user'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debugging line

      if (!token) {
        toast.error('No token found, please log in again.');
        return;
      }

      // Set the headers with the JWT token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post('https://hmb-cjz7.onrender.com/api/admin/create-user', formData, config);
      console.log(response.data);
      toast.success('User added successfully!');

      // Clear the form after successful submission
      setFormData(initialFormState);
    } catch (error) {
      console.error('There was an error adding the user!', error);
      toast.error('Failed to add user!');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add User
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Initial"
            name="initial"
            value={formData.initial}
            onChange={handleChange}
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone Number"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl required>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              row
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
          <FormControl required>
            <FormLabel>Course</FormLabel>
            <Select
              name="course"
              value={formData.course}
              onChange={handleChange}
            >
              <MenuItem value="Computer Science">Computer Science & Engineering</MenuItem>
              <MenuItem value="Electrical Engineering">Electrical Engineering</MenuItem>
              <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
              <MenuItem value="Civil Engineering">Civil Engineering</MenuItem>
              <MenuItem value="Business Administration">Business Administration</MenuItem>
            </Select>
          </FormControl>
          <FormControl required>
            <FormLabel>Year</FormLabel>
            <Select
              name="year"
              value={formData.year}
              onChange={handleChange}
            >
              <MenuItem value="1">1 Year</MenuItem>
              <MenuItem value="2">2 Year</MenuItem>
              <MenuItem value="3">3 Year</MenuItem>
              <MenuItem value="4">4 Year</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Date of Joining"
            name="dateOfJoining"
            type="date"
            value={formData.dateOfJoining}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <TextField
            label="Registration Number"
            name="regNo"
            value={formData.regNo}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add User
          </Button>
        </Box>
      </form>
      {/* Toast Container */}
      <ToastContainer />
    </Paper>
  );
};

export default AddUser;
