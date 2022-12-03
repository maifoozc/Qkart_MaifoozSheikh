import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TextField } from "@mui/material";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { Children, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { config } from "../App";
import axios from "axios";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();

  const [child, setChild] = useState(false);

  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to explore
        </Button>
      </Box>
    );
  } else {
    if (localStorage.getItem("token")) {
      let logoutFunction = () => {
        localStorage.clear();
        history.push("/");
      };
      // setChild(true);
      return (
        <Box className="header">
          <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>

          {children}

          <Stack direction="row" spacing={2}>
            <Avatar alt={localStorage.getItem("username")} src="avatar.png" />

            <p className="avatar_name">{localStorage.getItem("username")}</p>

            <Button
              className="explore-button"
              variant="text"
              onClick={logoutFunction}
            >
              Logout
            </Button>
          </Stack>
        </Box>
      );
    } else {
      let loginFunction = () => {
        history.push("/login");
      };
      let registerFunction = () => {
        history.push("/register");
      };
      return (
        <Box className="header">
          <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>
          {children}

          <Stack direction="row" spacing={2}>
            <Button variant="text" onClick={loginFunction}>
              Login
            </Button>

            <Button variant="contained" onClick={registerFunction}>
              Register
            </Button>
          </Stack>
        </Box>
      );
    }
  }
};
export default Header;
