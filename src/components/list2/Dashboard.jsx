import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Box, Grid, Paper, Typography, CircularProgress, Divider, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import PaymentIcon from '@mui/icons-material/Payment';

const MainCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  minWidth: '120px',
  color: theme.palette.text.secondary,
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const UDashboard = () => {
  const location = useLocation();
  const regNo = location.state?.regNo;

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (regNo) {
      const fetchUserDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://hmb-cjz7.onrender.com/api/student-details/${regNo}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200 && response.data) {
            setUserDetails(response.data);
          } else {
            console.error('Unexpected API response:', response);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [regNo]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Typography variant="h6" textAlign="center" mt={4}>
        No user details found for the provided registration number.
      </Typography>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Row 1: Personal Info */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <SectionTitle variant="h5">
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <PersonIcon />
              </Avatar>
              Personal Info
            </SectionTitle>
            <Divider sx={{ mb: 2 }} />
            <InfoItem>
              <InfoLabel variant="body1">Reg No:</InfoLabel>
              <InfoValue variant="body1">{userDetails.user.regNo}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel variant="body1">Name:</InfoLabel>
              <InfoValue variant="body1">{`${userDetails.user.firstName} ${userDetails.user.initial} ${userDetails.user.lastName}`}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel variant="body1">Email:</InfoLabel>
              <InfoValue variant="body1">{userDetails.user.email}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel variant="body1">Phone No:</InfoLabel>
              <InfoValue variant="body1">{userDetails.user.phoneNo}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel variant="body1">Course:</InfoLabel>
              <InfoValue variant="body1">{userDetails.user.course}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel variant="body1">Year:</InfoLabel>
              <InfoValue variant="body1">{userDetails.user.year}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel variant="body1">Address:</InfoLabel>
              <InfoValue variant="body1">{userDetails.user.address}</InfoValue>
            </InfoItem>
          </MainCard>
        </Grid>

        {/* Row 1: Room Details */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <SectionTitle variant="h5">
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <RoomIcon />
              </Avatar>
              Room Details
            </SectionTitle>
            <Divider sx={{ mb: 2 }} />
            <InfoItem>
              <InfoLabel variant="body1">Room No:</InfoLabel>
              <InfoValue variant="body1">{userDetails.room.roomNo}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel variant="body1">Floor:</InfoLabel>
              <InfoValue variant="body1">{userDetails.room.floor}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel variant="body1">Room Type:</InfoLabel>
              <InfoValue variant="body1">{userDetails.room.roomType}</InfoValue>
            </InfoItem>
          </MainCard>
        </Grid>

        {/* Row 2: Payment Details */}
        <Grid item xs={12}>
          <MainCard>
            <SectionTitle variant="h5">
              <Avatar sx={{ bgcolor: 'error.main' }}>
                <PaymentIcon />
              </Avatar>
              Payment Details
            </SectionTitle>
            <Divider sx={{ mb: 2 }} />
            <InfoItem>
              <InfoLabel variant="body1">Total Amount:</InfoLabel>
              <InfoValue variant="body1">{userDetails.payDetails.totalAmt}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel variant="body1">Paid Amount:</InfoLabel>
              <InfoValue variant="body1">{userDetails.payDetails.paidAmt}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel variant="body1">Due Amount:</InfoLabel>
              <InfoValue variant="body1">{userDetails.payDetails.dueAmt}</InfoValue>
            </InfoItem>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UDashboard;
