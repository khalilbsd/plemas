import React, { useRef, useState } from "react";
import { styles } from "./styles";
import { Grid, TextField } from "@mui/material";
import ResetPassword from "../../reset_password/ResetPassword";
import { useRequestResetPasswordMutation } from "../../../store/api/auth/authentification";
import { notify } from "../notification/notification";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import Loading from "../loading/Loading";
import { ToastContainer } from "react-toastify";

const ResetNotAuthUser = ({ handleSuccess, handleFailure }) => {
  const emailRef = useRef();
  const classes = styles();

  // const [password, setPasswordError] = useState({
  //   error: false,
  //   message: ""
  // });

  const [requestResetPassword, { isLoading }] =
    useRequestResetPasswordMutation();


  const handleVerificationSuccess = ()=>{
    setIsEmailVerified(true);
    handleSuccess()
  }
  const handleVerificationFailure = ()=>{
    setIsEmailVerified(false);
    handleFailure()
  }

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const handleSubmitEmailForm = async (e) => {
    e.preventDefault();

    try {
      const res = await requestResetPassword({
        email: emailRef.current.value
      }).unwrap();
      notify(NOTIFY_SUCCESS, res?.message);
      handleVerificationSuccess()

    } catch (error) {
      notify(NOTIFY_ERROR, error?.data.message);
      handleVerificationFailure()
    }
  };

  const EmailVerificationForm = () => {
    return (
      <form method="POST" onSubmit={handleSubmitEmailForm}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <TextField
              required
              type="email"
              className={classes.input}
              name="email"
              variant="outlined"
              label="email"
              inputRef={emailRef}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <button type="submit" className={classes.emailSendBtn}>
              {" "}
              Send reset password email{" "}
            </button>
          </Grid>
        </Grid>
      </form>
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className={classes.authUserForm}>
      {!isEmailVerified ? (
        <EmailVerificationForm />
      ) : (
        <>
        <h3 className={classes.titleAction}>Email verified </h3>
          <div className={classes.validContainer}>
          your email has been verified and we sent you a request link to be
          able to reset your password. You can safely close this page.
        </div>
        </>
      )}
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
    </div>
  );
};

export default ResetNotAuthUser;
