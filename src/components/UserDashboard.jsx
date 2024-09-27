import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Typography,
  Divider,
  Box,
  InputBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from './AuthContext';


const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const MainContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100%',
});

const DrawerContainer = styled(Drawer)(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedDrawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : collapsedDrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: '#f5f5f5',
    color: '#000',
  },
}));

const AppBarContainer = styled(AppBar)(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? drawerWidth : collapsedDrawerWidth,
  width: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
  backgroundColor: "#3f51b5",
}));

const MainContent = styled('main')(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: open ? drawerWidth : collapsedDrawerWidth,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(8),
}));

const ToggleButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '64px',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#000',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: "#3f51b5",
    color: '#fff',
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const UserDashboard = () => {
  const [open, setOpen] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { authState, logout } = useContext(AuthContext);

  useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  useEffect(() => {
    console.log('Logged in regNo:', authState.username);
  }, [authState.username]);

  useEffect(() => {
    if (location.pathname === '/user-dashboard') {
      navigate('dashboard', { state: { regNo: authState.username } });
    }
  }, [location.pathname, navigate, authState.username]);

  const handleDrawerToggle = useCallback(() => {
    setOpen(prevOpen => !prevOpen);
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const menuItems = useMemo(() => [
    { text: 'Dashboard', icon: <HomeIcon />, path: 'dashboard', state: { regNo: authState.username } },
    { text: 'Log Book', icon: <AccountCircleIcon />, path: 'logbook', state: { regNo: authState.username } },
    { text: 'Log Entries', icon: <SettingsIcon />, path: 'logentries', state: { regNo: authState.username } },
    { text: 'Complaints Box', icon: <SettingsIcon />, path: 'compbox', state: { regNo: authState.username } },
  ], [authState.username]);

  return (
    <MainContainer>
      <CssBaseline />
      <DrawerContainer variant="permanent" open={open}>
        <ToggleButtonContainer onClick={handleDrawerToggle}>
          {open ? 'HostelManager' : <ChevronRightIcon />}
        </ToggleButtonContainer>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem 
              button 
              component={Link} 
              to={item.path} 
              state={item.state} // Pass the state here
              key={index}
            >
              <ListItemIcon style={{ color: '#000' }}>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.text} style={{ color: '#000' }} />}
            </ListItem>
          ))}
        </List>
      </DrawerContainer>
      <AppBarContainer position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            User Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          
          <Button
            color="inherit"
            startIcon={<AccountCircleIcon />}
            onClick={handleMenuClick}
          >
            {authState.username}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBarContainer>
      <MainContent open={open}>
        <Outlet />
      </MainContent>
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </MainContainer>
  );
};

export default UserDashboard;
