import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogFormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "left",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    // Add hover effects if needed
  },
}));

const LogForm = () => {
  const location = useLocation();
  const regNo = location.state?.regNo;

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState("");
  const [isBack, setIsBack] = useState(false);

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
              currentLog: response.data.user.currentLog,
            });
            setIsBack(!!response.data.user.currentLog); // Set isBack based on currentLog field
          } else {
            console.error("Unexpected API response:", response);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [regNo]);

  const handleBackClick = async () => {
    const token = localStorage.getItem("token");
    try {
      const outTime = new Date().toISOString();
      await axios.post(
        "https://hmb-cjz7.onrender.com/api/logs",
        { regNo, roomNo: userDetails.roomNo, remarks, outTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsBack(true);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error updating outTime:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  const handleReturnClick = async () => {
    const token = localStorage.getItem("token");
    try {
      const inTime = new Date().toISOString();
      await axios.put(
        `https://hmb-cjz7.onrender.com/api/logs/${regNo}`,
        { inTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsBack(false);
      toast.success("Logged back in successfully!");
    } catch (error) {
      console.error("Error updating inTime:", error);
      toast.error("Error logging back in. Please try again.");
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
      <LogFormCard>
        <Typography variant="h5" gutterBottom>
          {isBack ? "Log-In Form" : "Log-Out Form"}
        </Typography>
        {!isBack && (
          <>
            <Typography variant="body1" gutterBottom>
              <strong>Reg No:</strong> {userDetails.regNo}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Room No:</strong> {userDetails.roomNo}
            </Typography>
            <TextField
              label="Remarks"
              variant="outlined"
              fullWidth
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleBackClick}
            >
              I'll be back
            </Button>
          </>
        )}
        {isBack && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleReturnClick}
          >
            I'm Back
          </Button>
        )}
      </LogFormCard>
      <ToastContainer />
    </Box>
  );
};

export default LogForm;
