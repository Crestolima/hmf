import {
    Box,
    Button,
    Modal,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../components/AuthContext";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EditUser = ({ open, handleClose, user, setUsers }) => {
  const [formData, setFormData] = useState({});
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        dateOfBirth: formatDate(user.dateOfBirth)
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://hmb-cjz7.onrender.com/api/users/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('User updated successfully!');
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === user._id ? response.data : u))
      );
      handleClose();
    } catch (error) {
      console.error('There was an error updating the user!', error);
      toast.error('Failed to update user!');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component={Paper}>
        <Typography variant="h4" gutterBottom>
          Edit User
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Initial"
              name="initial"
              value={formData.initial || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Phone Number"
              name="phoneNo"
              value={formData.phoneNo || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Registration Number"
              name="regNo"
              value={formData.regNo || ''}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </form>
        <ToastContainer />
      </Box>
    </Modal>
  );
};

export default EditUser;
