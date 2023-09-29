import { Box, Button, InputAdornment, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoginUserMutation } from "../../store/api/auth/authentification.js";
import { setCredentials } from "../../store/reducers/auth.js";
import logo from "../public/images/logo.webp";
import { styles } from "./style.js";
// import AccountCircle from '@mui/icons-material/AccountCircle';
import { faAt, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../Components/loading/Loading.jsx";
import { notify } from "../Components/notification/notification.js";
import { NOTIFY_ERROR } from "../../constants/constants.js";
import useGetAuthenticatedUser from "../../hooks/authenticated.js";
import { useState } from "react";
const Login = () => {
  const classes = styles();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate =useNavigate()
  // const user =useGetAuthenticatedUser()
  // const [error, setError] = useState(null)
  // console.log(user);
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await loginUser({
        email: emailRef.current.value,
        password: passwordRef.current.value
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      setTimeout(() => {
          navigate('/profile/me')
          setLoading(isLoading)
      }, 4000);
    } catch (err) {

      notify(NOTIFY_ERROR,err.data?.message)
    }
  };

  return (
    <div className={classes.bg}>
      <Box className={classes.loginBox}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={12} md={12}>
              <div>
                <img src={logo} alt="logo midgrad" />
              </div>
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
              <h1>Login</h1>
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
              {loading && (
                <Loading/>
              )}
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
              {/* <TextField required size="small" inputRef={emailRef} className={classes.input} id="email" name="email" label="Email" variant="outlined" /> */}
              <TextField
                required
                size="small"
                inputRef={emailRef}
                autoComplete="on"
                className={classes.input}
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {/* <AccountCircle /> */}
                      <FontAwesomeIcon icon={faAt} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
              <TextField
                type="password"
                required
                size="small"
                inputRef={passwordRef}
                className={classes.input}
                id="password"
                label="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {/* <AccountCircle /> */}
                      <FontAwesomeIcon icon={faLock} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Link to={"reset-password"}>Forget Password ?</Link>
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
              <Button type="submit" variant="outlined">
                login
              </Button>
            </Grid>
          </Grid>
        </form>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Box>
    </div>
  );
};

export default Login;
