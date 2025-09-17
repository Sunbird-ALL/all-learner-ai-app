import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import {
  fetchUserCheck,
  fetchVirtualId,
} from "../../services/userservice/userService";
import "./LoginPage.css";
import { setLocalData } from "../../utils/constants";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { initialize } from "../../services/telementryService";
import { startEvent } from "../../services/callTelemetryIntract";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState(0); // 0 = Student, 1 = Guest

  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const ranonce = useRef(false);

  // Handle tab switch
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 1) {
      setUsername("GT_"); // 👈 Default for Guest
    } else {
      setUsername("");
    }
    setPassword("");
  };

  // Handle username change (prefix GT_ for guest)
  const handleUsernameChange = (e) => {
    let value = e.target.value;

    if (activeTab === 1) {
      // Always enforce "GT_" prefix
      if (!value.startsWith("GT_")) {
        value = "GT_" + value.replace(/^GT_*/, "");
      }
    }
    setUsername(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    localStorage.clear();

    try {
      const userCheckDetails = await fetchUserCheck(username);
      if (
        userCheckDetails?.message === "Login successful" ||
        userCheckDetails?.message === "Registered successfully"
      ) {
        const usernameDetails = await fetchVirtualId(username);
        let token = usernameDetails?.result?.token;

        if (token) {
          localStorage.setItem("apiToken", token);
          setLocalData("profileName", username);

          const initService = async (visitorId) => {
            await initialize({
              context: {
                mode: process.env.REACT_APP_MODE,
                authToken: token,
                did: localStorage.getItem("deviceId") || visitorId,
                uid: username || "anonymous",
                channel: process.env.REACT_APP_CHANNEL,
                env: process.env.REACT_APP_ENV,
                pdata: {
                  id: process.env.REACT_APP_ID,
                  ver: process.env.REACT_APP_VER,
                  pid: process.env.REACT_APP_PID,
                },
                tags: [""],
                timeDiff: 0,
                host: process.env.REACT_APP_HOST,
                endpoint: process.env.REACT_APP_ENDPOINT,
                apislug: process.env.REACT_APP_APISLUG,
              },
              config: {},
              metadata: {},
            });

            if (!ranonce.current) {
              if (!localStorage.getItem("contentSessionId")) {
                startEvent();
              }
              ranonce.current = true;
            }
          };

          const fp = await FingerprintJS.load();
          const { visitorId } = await fp.get();
          await initService(visitorId);

          navigate("/discover-start");
        } else {
          alert("Enter correct username and password");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && data?.message === "Required fields are missing") {
          alert("Please register the user before login.");
        } else if (status === 401 && data?.message === "unauthorized access") {
          alert("Unauthorized access. Please register first.");
        } else {
          alert(data?.message || "Login failed. Please try again.");
        }
      } else {
        alert("Something went wrong. Please try again after some time.");
      }
    }
  };

  return (
    <div className={`login-container ${isMobile ? "mobile-view" : ""}`}>
      <div className="loginBox">
        {/* Title */}
        <Typography
          variant="h3"
          align="center"
          sx={{ marginBottom: "20px", fontWeight: "bold" }}
        >
          Login
        </Typography>

        {/* Tabs */}
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "20px" }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab label="Student" />
            <Tab label="Guest" />
          </Tabs>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Username */}
            <Grid item xs={12}>
              <TextField
                className="textField"
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={handleUsernameChange}
                required
                inputProps={{
                  minLength: activeTab === 1 ? 4 : undefined, // at least "GT_"
                }}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12}>
              <TextField
                className="textField"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            {/* Login Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {activeTab === 0 ? "Login as Student" : "Login as Guest"}
              </Button>
            </Grid>

            {/* Register Link */}
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Register
                </span>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
