import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, makeStyles } from '@material-ui/core';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/path/to/your/background-image.jpg)', // Background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  signupCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Gradient background
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: theme.shadows[5],
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: 'white',
    color: '#764ba2',
    '&:hover': {
      backgroundColor: '#764ba2',
      color: 'white',
    },
  },
  textField: {
    marginBottom: theme.spacing(2),
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
  },
  link: {
    color: 'white',
  },
  typography: {
    color: 'white',
  },
}));

const SignupForm = () => {
  const classes = useStyles(); // Use custom styles
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Directly send the role as 'admin' in the request
      await axios.post('https://hmb-cjz7.onrender.com/api/admin/register', { username, password, role: 'admin' });
      navigate('/login');
    } catch (err) {
      setError('Error registering admin: ' + (err.response ? err.response.data : err.message));
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="xs">
        <Box className={classes.signupCard}>
          <Typography variant="h4" className={classes.typography}>Admin Signup</Typography>
          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={classes.textField}
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
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" fullWidth variant="contained" className={classes.submit}>
              Signup
            </Button>
          </form>
          <Typography variant="body2" className={classes.typography} style={{ marginTop: '20px' }}>
            Already have an account? <Link to="/login" className={classes.link}>Login</Link>
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default SignupForm;
