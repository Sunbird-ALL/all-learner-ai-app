import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/userservice/userService";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await register(formData?.userName);

      if (response?.message === "Registered successfully") {
        alert(
          "Registered successfully! Please go to the login page and log in."
        );
        navigate("/login");
      }

      return response;
    } catch (error) {
      console.error("Error during registration:", error);

      if (error.response) {
        const { status, data } = error.response;
        const message = data?.message;

        if (message === "Required fields are missing") {
          alert("Please enter the correct PEN's ID.");
        } else if (status === 401 && message === "Unauthorized access") {
          alert("Unauthorized access. Please check your PEN's ID.");
        } else if (status === 400) {
          alert(message || "Bad request. Please check your input.");
        } else {
          alert(message || "Registration failed. Please try again.");
        }
      } else if (error.request) {
        alert(
          "No response from the server. Please check your network connection."
        );
      } else {
        alert("Something went wrong. Please try again after some time.");
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
                <Link
                  to="/login"
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
