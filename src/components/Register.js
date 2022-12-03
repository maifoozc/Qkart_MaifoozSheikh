import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  let history = useHistory();
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const [loading, setLoading] = useState(null);

  const [input_data, setInput_Data] = useState({
    input_username: "",
    input_password: "",
    input_confirm_password: "",
  });
  let URL = `${config.endpoint}/auth/register`;

  const register = async (formData) => {
    validateInput(input_data);
    if (validateInput(input_data)) {
      let response = await axios
        .post(URL, {
          username: input_data.input_username,
          password: input_data.input_password,
        })
        .then((res) => {
          console.log(res);
          enqueueSnackbar("Registered successfully", { variant: "success" });
          history.push("/login");
          return res;
        })
        .catch((err) => {
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

      // console.log(response.status);
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */

  const validateInput = (data) => {
    console.log(data);
    let valid_username;
    let valid_password;
    let valid_confirmPassword;
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
    } else if (data.input_password !== data.input_confirm_password) {
      return enqueueSnackbar("Passwords do not match", { variant: "error" });
    } else {
      return true;
    }

    // input_confirm_password
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={(e) => {
              setInput_Data({ ...input_data, input_username: e.target.value });
            }}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={(e) => {
              setInput_Data({ ...input_data, input_password: e.target.value });
            }}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={(e) => {
              setInput_Data({
                ...input_data,
                input_confirm_password: e.target.value,
              });
            }}
          />
          <Button
            className="button"
            variant="contained"
            onClick={() => {
              register();
            }}
          >
            Register Now
          </Button>
          <p className="secondary-action">
            Already have an account?{" "}
            <a className="link" href="#">
              Login here
            </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
