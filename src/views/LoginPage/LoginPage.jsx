import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import config from "../../utils/urlConstants.json";
import { useMediaQuery } from "@mui/material";
import { fetchVirtualId } from "../../services/userservice/userService";
import { jwtDecode } from "jwt-decode";
import "./LoginPage.css";
import { setLocalData } from "../../utils/constants";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { initialize } from "../../services/telementryService";
import { startEvent } from "../../services/callTelemetryIntract";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const ranonce = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }
    localStorage.clear();

    try {
      const usernameDetails = await fetchVirtualId(username);
      let token = usernameDetails?.result?.token;

      localStorage.setItem("token", token);
      // const tokenDetails = jwtDecode(token);
      if (token) {
        setLocalData("profileName", username);

        const initService = async (visitorId) => {
          await initialize({
            context: {
              mode: import.meta.env.VITE_MODE,
              authToken: token,
              did: localStorage.getItem("deviceId") || visitorId,
              uid: username || "anonymous",
              channel: import.meta.env.VITE_CHANNEL,
              env: import.meta.env.VITE_ENV,
              pdata: {
                id: import.meta.env.VITE_ID,
                ver: import.meta.env.VITE_VER,
                pid: import.meta.env.VITE_PID,
              },
              tags: [""],
              timeDiff: 0,
              host: import.meta.env.VITE_HOST,
              endpoint: import.meta.env.VITE_ENDPOINT,
              apislug: import.meta.env.VITE_APISLUG,
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
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={`login-container ${isMobile ? "mobile-view" : ""}`}>
      <div className="loginBox">
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                className="textField"
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="textField"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
