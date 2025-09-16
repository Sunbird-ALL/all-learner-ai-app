import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  //   MenuItem,
  useMediaQuery,
} from "@mui/material";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// const indianStates = [
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chhattisgarh",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
//   "Andaman and Nicobar Islands",
//   "Chandigarh",
//   "Dadra and Nagar Haveli and Daman and Diu",
//   "Delhi",
//   "Jammu and Kashmir",
//   "Ladakh",
//   "Lakshadweep",
//   "Puducherry",
// ];

const RegisterPage = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    // userId: "",
    // state: "",
    // password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const API_HOST_VIRTUAL_ID_HOST = process.env.REACT_APP_VIRTUAL_ID_HOST;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_HOST_VIRTUAL_ID_HOST}/api/student/register?type=single`,
        { username: formData.userName }
      );

      // ✅ Success
      if (response?.data?.message === "Registered successfully") {
        alert(
          "Registered successfully! Please go to the login page and login."
        );
        navigate("/login"); // redirect to login page
      }

      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && data?.message === "Required fields are missing") {
          alert("Please fill in all fields correctly.");
        } else if (status === 401 && data?.message === "unauthorized access") {
          alert("Unauthorized access. Please check your details.");
        } else {
          alert(data?.message || "Registration failed. Please try again.");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className={`register-container ${isMobile ? "mobile-view" : ""}`}>
      <div className="registerBox">
        <Typography
          variant="h3"
          align="center"
          sx={{ marginBottom: "30px", fontWeight: "bold" }}
        >
          Student Register
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Username */}
            <Grid item xs={12}>
              <TextField
                className="textField"
                label="Username"
                variant="outlined"
                fullWidth
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* User ID */}
            {/* <Grid item xs={12}>
              <TextField
                className="textField"
                label="Student/User ID"
                variant="outlined"
                fullWidth
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              />
            </Grid> */}

            {/* State Selection */}
            {/* <Grid item xs={12}>
              <TextField
                className="textField"
                select
                label="Select State"
                variant="outlined"
                fullWidth
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                {indianStates.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}

            {/* Password */}
            {/* <Grid item xs={12}>
              <TextField
                className="textField"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid> */}

            {/* Register Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Register
              </Button>
            </Grid>

            {/* Login Link */}
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={{
                    color: "#1976d2", // MUI primary blue
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </span>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
