import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Grid } from "@mui/material";
import { fetchVirtualId } from "../../services/userservice/userService";
import "./LoginPage.css"; // Import the CSS file
import { setProfileName, setToken } from "../../store/slices/userJourney.slice";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

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

      // localStorage.setItem("apiToken", token);
      localStorage.setItem("isLogin", true);
      // const tokenDetails = jwtDecode(token);
      if (token) {
        dispatch(setToken(token));
        dispatch(setProfileName(username));
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
    <Container className="container">
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
    </Container>
  );
};

export default LoginPage;
