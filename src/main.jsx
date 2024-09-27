// src/main.jsx
import { render } from 'preact'; 
import App from './app.jsx';
import './index.css'; 
import { ThemeProvider, createTheme } from '@mui/material/styles'; 

// Creating  a theme add more if needed
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Custom primary color
    },
    secondary: {
      main: '#dc004e', // Custom secondary color
    },
  },
  
});


render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('app') 
);
