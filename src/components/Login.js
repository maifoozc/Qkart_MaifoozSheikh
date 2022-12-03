import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  let history = useHistory();
  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const [input_data, setInput_Data] = useState({
    input_username: "",
    input_password: "",
  });

  let URL = `${config.endpoint}/auth/login`;

  const [persistData, setPersistData] = useState({
    username: "",
    token: "",
    balance: "",
  });

  const login = async (formData) => {
    validateInput(input_data);

    if (validateInput(input_data)) {
      let response = await axios
        .post(URL, {
          username: input_data.input_username,
          password: input_data.input_password,
        })
        .then((res) => {
          console.log(res.data);
          persistLogin(res.data.token, res.data.username, res.data.balance);

          enqueueSnackbar("Logged in successfully", { variant: "success" });
          history.push("/");
          return res;
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 400) {
            enqueueSnackbar(err.response.data.message, { variant: "error" });
            console.log(err.response.data.message);
          } else {
            enqueueSnackbar(
              "Someting went wrong. Check that the backend is running",
              { variant: "error" }
            );
          }
        });
    }
  };
  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    let valid_username;
    let valid_password;
    if (data.input_username === "") {
      return enqueueSnackbar("Username is a required field", {
        variant: "error",
      });
    } else if (data.input_username.length < 6) {
      return enqueueSnackbar("Username must be at least 6 characters", {
        variant: "error",
      });
    } else if (data.input_password === "") {
      return enqueueSnackbar("Password is a required field", {
        variant: "error",
      });
    } else if (data.input_password.length < 6) {
      return enqueueSnackbar("Password must be at least 6 characters", {
        variant: "error",
      });
    } else {
      return true;
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    console.log(token, username, balance);
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            type="text"
            label="username"
            onChange={(e) => {
              setInput_Data({
                ...input_data,
                input_username: e.target.value,
              });
            }}
          />

          <TextField
            type="text"
            label="password"
            onChange={(e) => {
              setInput_Data({
                ...input_data,
                input_password: e.target.value,
              });
            }}
          />

          <Button variant="contained" onClick={login}>
            LOGIN TO QKART
          </Button>

          <p>
            Don’t have an account?{" "}
            <span>
              <Link to="/register">Register now</Link>
            </span>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};
export default Login;
