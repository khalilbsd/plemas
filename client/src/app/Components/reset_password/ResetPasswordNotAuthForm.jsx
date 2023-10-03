import React, { useEffect, useRef, useState } from "react";
import { styles } from "./styles";
import { styles as layoutStyles } from "../../reset_password/style";
import { Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  useResetPasswordWithTokenMutation,
  useVerifyResetPasswordTokenMutation
} from "../../../store/api/auth/authentification";
import { notify } from "../notification/notification";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import Loading from "../loading/Loading";
import { ToastContainer } from "react-toastify";
import { ReactSVG } from "react-svg";

import faSadFace from '../../public/svgs/light/face-sad-tear.svg'

const ResetPasswordNotAuthForm = () => {
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const classes = styles();
  const layoutClasses = layoutStyles();
  const params = useParams();
  const navigate = useNavigate();
  const [verifyResetPasswordToken, { isLoading }] =
    useVerifyResetPasswordTokenMutation();
  const [resetPasswordWithToken, { isLoading: loadingReset }] =
    useResetPasswordWithTokenMutation();
  const [password, setPasswordError] = useState({
    error: false,
    message: ""
  });
  // const [first, setfirst] = useState(second)

  useEffect(() => {
    async function verifyToken() {
      try {
        await verifyResetPasswordToken(params.token).unwrap();
      } catch (error) {
        console.log(error);
        setPasswordError({ error: true, message: error?.data?.message });
      }
    }
    verifyToken();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    console.log(params.token);
    try {


      const res = await resetPasswordWithToken({        password: newPasswordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
        token:params.token
      }).unwrap();
      notify(NOTIFY_SUCCESS, res.message);
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  if (loadingReset || isLoading) return <Loading />;
  if (!params.token) return <Navigate to="/login" replace />;

  return (
    <div className={layoutClasses.resetPasswordPage}>
      {!password.error ? (
        <Box className={layoutClasses.box}>
          <h2 className={layoutClasses.pageTitle}>Reset your password</h2>
          <h3 className={layoutClasses.text}>
            Please type in you new password and re-confirm it
          </h3>
          <div className={classes.authUserForm}>
            <form method="POST" onSubmit={handleResetPassword}>
              <Grid container spacing={2}>
                {password.error && (
                  <Grid item xs={12} lg={12}>
                    <span className={classes.errorText}>
                      {password.message}
                    </span>
                  </Grid>
                )}
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={password.error}
                    size="small"
                    type="password"
                    label="New Password"
                    name="password"
                    inputRef={newPasswordRef}
                    className={classes.input}
                    required
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={password.error}
                    required
                    size="small"
                    type="password"
                    label="Confirm new password"
                    name="password"
                    inputRef={confirmPasswordRef}
                    className={classes.input}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <button type="submit" className={classes.emailSendBtn}>
                    {" "}
                    Reset your password{" "}
                  </button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Box>
      ) : (
        <Box className={layoutClasses.box}>
          <div className={layoutClasses.imageContainer}>
                <ReactSVG
                  src={faSadFace}
                  className={`${layoutClasses.notificationIcon} failed`}
                />
              </div>
          <h2 className={classes.titleAction}>Oopps! Something happened</h2>
          <h3 className={classes.errorText}>{password.message}</h3>
          <Link to='/login'>Go to login</Link>
        </Box>
      )}
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordNotAuthForm;
