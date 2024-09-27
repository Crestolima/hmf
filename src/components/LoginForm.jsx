import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  makeStyles
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect fill='%23f0f4f8' width='1200' height='800'/%3E%3Cg fill='%23dde5ed' fill-opacity='0.4'%3E%3Cpath d='M0 0h100v100H0z'/%3E%3Cpath d='M100 0h100v100H100z' transform='translate(50 50) rotate(45)'/%3E%3Cpath d='M200 0h100v100H200z'/%3E%3Cpath d='M300 0h100v100H300z' transform='translate(50 50) rotate(45)'/%3E%3Cpath d='M400 0h100v100H400z'/%3E%3Cpath d='M500 0h100v100H500z' transform='translate(50 50) rotate(45)'/%3E%3Cpath d='M600 100h100v100H600z'/%3E%3Cpath d='M700 100h100v100H700z' transform='translate(50 50) rotate(45)'/%3E%3Cpath d='M800 100h100v100H800z'/%3E%3Cpath d='M900 100h100v100H900z' transform='translate(50 50) rotate(45)'/%3E%3Cpath d='M1000 100h100v100H1000z'/%3E%3Cpath d='M1100 100h100v100H1100z' transform='translate(50 50) rotate(45)'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    animation: '$fadeIn 1s ease-in-out',
  },
  loginCard: {
    background: 'linear-gradient(135deg, #3a6186 0%, #89253e 100%)',
    borderRadius: theme.spacing(3),
    padding: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    animation: '$fadeIn 1.5s ease-in-out',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#f0f4f8',
    color: '#3a6186',
    '&:hover': {
      backgroundColor: '#dde5ed',
    },
    borderRadius: theme.spacing(3),
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  textField: {
    marginBottom: theme.spacing(2.5),
    '& label.Mui-focused': {
      color: '#f0f4f8',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#f0f4f8',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(2),
      '& fieldset': {
        borderColor: '#f0f4f8',
      },
      '&:hover fieldset': {
        borderColor: '#dde5ed',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#f0f4f8',
      },
    },
  },
  typography: {
    color: '#f0f4f8',
    marginBottom: theme.spacing(3),
    fontWeight: 'bold',
  },
  toggleButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  toggleButton: {
    color: '#f0f4f8',
    borderColor: '#f0f4f8',
    '&.Mui-selected': {
      backgroundColor: '#89253e',
      color: '#f0f4f8',
    },
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1, 3),
    transition: 'all 0.3s ease',
  },
}));

const LoginForm = () => {
  const classes = useStyles();
  const [usernameOrRegNo, setUsernameOrRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = role === 'user' ? 'https://hmb-cjz7.onrender.com/api/user/login' : 'https://hmb-cjz7.onrender.com/api/admin/login';
      const payload = role === 'user' ? { regNo: usernameOrRegNo, password } : { username: usernameOrRegNo, password };
      const res = await axios.post(endpoint, payload);
      const identifier = role === 'user' ? res.data.regNo : res.data.username;
  
      login(res.data.token, role, identifier);
      toast.success(`${role === 'user' ? 'User' : 'Admin'} login successful!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data || 'Login failed';
      
      if (errorMsg === 'User not found or role mismatch') {
        toast.error('You do not have user access rights.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (errorMsg === 'Admin not found or role mismatch') {
        toast.error('You do not have admin access rights.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (errorMsg === 'Invalid credentials') {
        toast.error('Invalid username or password.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="xs">
        <Box className={classes.loginCard}>
          <Typography variant="h4" className={classes.typography}>
            Hostel Manager 
          </Typography>
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={handleRoleChange}
            className={classes.toggleButtons}
            aria-label="role selection"
          >
            <ToggleButton value="user" className={classes.toggleButton}>
              Resident
            </ToggleButton>
            <ToggleButton value="admin" className={classes.toggleButton}>
              Admin
            </ToggleButton>
          </ToggleButtonGroup>
          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={role === 'user' ? 'Reg Number' : 'Username'}
              value={usernameOrRegNo}
              onChange={(e) => setUsernameOrRegNo(e.target.value)}
              className={classes.textField}
              InputProps={{
                style: { color: '#f0f4f8' },
              }}
              InputLabelProps={{
                style: { color: '#f0f4f8' },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={classes.textField}
              InputProps={{
                style: { color: '#f0f4f8' },
              }}
              InputLabelProps={{
                style: { color: '#f0f4f8' },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              Login
            </Button>
          </form>
        </Box>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;