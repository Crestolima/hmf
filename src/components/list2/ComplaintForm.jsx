import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ComplaintFormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "left",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {},
}));

const ComplaintCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: 8,
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
}));

const ComplaintBox = () => {
  const location = useLocation();
  const regNo = location.state?.regNo;

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if (regNo) {
      const fetchUserDetails = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `https://hmb-cjz7.onrender.com/api/student-details/${regNo}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200 && response.data) {
            setUserDetails({
              regNo: response.data.user.regNo,
              roomNo: response.data.room.roomNo,
            });
          } else {
            console.error("Unexpected API response:", response);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setLoading(false);
        }
      };

      const fetchUserComplaints = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `https://hmb-cjz7.onrender.com/api/complaints/user/${regNo}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setComplaints(response.data);
        } catch (error) {
          console.error("Error fetching complaints:", error);
        }
      };

      fetchUserDetails();
      fetchUserComplaints();
    } else {
      setLoading(false);
    }
  }, [regNo]);

  const fetchUserComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://hmb-cjz7.onrender.com/api/complaints/user/${regNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleComplaintSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "https://hmb-cjz7.onrender.com/api/complaints",
        { regNo: userDetails.regNo, roomNo: userDetails.roomNo, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReason("");
      toast.success("Complaint submitted successfully");
      await fetchUserComplaints(); // Fetch complaints again to update the list
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Failed to submit complaint");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
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
      <ToastContainer />
      <ComplaintFormCard>
        <Typography variant="h5" gutterBottom>
          Complaint Box
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Reg No:</strong> {userDetails.regNo}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Room No:</strong> {userDetails.roomNo}
        </Typography>
        <TextField
          label="Reason"
          variant="outlined"
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleComplaintSubmit}
        >
          Submit Complaint
        </Button>
      </ComplaintFormCard>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Your Complaints
        </Typography>
        <Grid container spacing={2}>
          {complaints.map((complaint) => (
            <Grid item xs={12} sm={6} md={4} key={complaint._id}>
              <ComplaintCard>
                <CardContent>
                  <Typography variant="subtitle1" color="textSecondary">
                    {complaint.reason}
                  </Typography>
                  <Typography variant="body2" color="textPrimary">
                    Status: <strong>{complaint.status}</strong>
                  </Typography>
                </CardContent>
              </ComplaintCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ComplaintBox;
