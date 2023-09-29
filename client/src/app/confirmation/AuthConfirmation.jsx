import React, { useEffect, useRef, useState } from "react";
import useGetAuthenticatedUser from "../../hooks/authenticated";
import Loading from "../Components/loading/Loading";
import { useNavigate, useParams } from "react-router";
import ErrorConfirmationAuthedUser from "../Components/confirmation/ErrorConfirmationAuthedUser";
import { useVerifyTokenConfirmationMutation } from "../../store/api/users.api";
import { useDispatch } from "react-redux";
import { notify } from "../Components/notification/notification";
import { NOTIFY_ERROR } from "../../constants/constants";
import { Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { styles } from "./styles";
import { useChangePasswordMutation } from "../../store/api/auth/authentification";

const AuthConfirmation = () => {
  const user = useGetAuthenticatedUser();
  const classes = styles();
  const [errorAuthed, setErrorAuthed] = useState(false);
  const [error, setError] = useState({ state: false, message: "" });
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();
  const [verifyTokenConfirmation, { isLoading }] =
    useVerifyTokenConfirmationMutation();
  const [changePassword, {}] = useChangePasswordMutation();
  const params = useParams();
  useEffect(() => {
    async function verify() {
      const token = params.token;
      try {
        const res = await verifyTokenConfirmation(token).unwrap();

        setUserEmail(res?.email);
      } catch (error) {
        navigate("/login");
      }
    }
    setError({ state: false, message: "" });
    if (user.isAuthenticated) return setErrorAuthed(true);
    verify();
  }, [user.loading]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== confirmPasswordRef.current.value)
      return setError({ state: true, message: "The passwords doesn't match " });
    setError({ state: false, message: "" });
    try {
      await changePassword({
        email: userEmail,
        password: passwordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value
      });
      navigate("/login");
    } catch (error) {
      notify(NOTIFY_ERROR, error.data?.message);
    }
  };

  if (user.loading || isLoading) return <Loading />;

  if (errorAuthed) return <ErrorConfirmationAuthedUser />;

  // if (error.state) return <ErrorConfirmation messages={error.message} />
  return (
    <Box className={classes.box}>
      <h1 className={classes.boxTitle}>You need to set you're password</h1>
      <p>
        you'll be setting you're password for the first time. after this you'll
        be redirected to the login page there you'll need to enter your email
        and you password in order for your account to be unlocked{" "}
      </p>
      <form method="POST" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
            <TextField
              className={classes.inputs}
              error={error.state}
              variant="outlined"
              type="password"
              name="password"
              label="password"
              inputRef={passwordRef}
              helperText={error.message}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <TextField
              className={classes.inputs}
              error={error.state}
              variant="outlined"
              type="password"
              name="confirmPassword"
              label="Confirm password"
              inputRef={confirmPasswordRef}
              helperText={error.message}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <button type="submit" className={classes.saveBtn}>
              Save password
            </button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AuthConfirmation;
