import React, { useState } from "react";
import { styles } from "./style";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import useGetAuthenticatedUser from "../../hooks/authenticated";
import Loading from "../Components/loading/Loading";
import ResetAuthUser from "../Components/reset_password/ResetAuthUser";
import ResetNotAuthUser from "../Components/reset_password/ResetNotAuthUser";
import { ReactSVG } from "react-svg";
import faResetSuccess from "../public/svgs/light/shield-check.svg";
import faVerified from "../public/svgs/solid/badge-check.svg";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const classes = styles();
  const user = useGetAuthenticatedUser();
  const [isReseted, setIsReseted] = useState(false);
  const [isVerified, setVerified] = useState(false);

  if (user.loading) return <Loading />;

  const handleResetedSuccess = () => {
    setIsReseted(true);
  };
  const handleResetedFailure = () => {
    setIsReseted(false);
  };

  const handleVerificationSuccess = () => {
    setVerified(true);
  };
  const handleVerificationFailure = () => {
    setVerified(false);
  };

  return (
    <div className={classes.resetPasswordPage}>
      <Box className={classes.box}>
        {!isReseted && !isVerified ? (
          <>
            <h2 className={classes.pageTitle}>Reset your password</h2>
            <h3 className={classes.text}>
              {!isReseted &&
                !isVerified &&
                (!user.isAuthenticated
                  ? "To reset your password first you need we confirm you account. Please type in  you email address in the box bellow "
                  : "To reset your password we need you to confirm your old password first in order for us to be able to protect your account ")}
            </h3>
          </>
        ) : (
          <>
            {isReseted && (
              <div className={classes.imageContainer}>
                <ReactSVG
                  src={faResetSuccess}
                  className={`${classes.notificationIcon} success`}
                />
              </div>
            )}
            {isVerified && (
              <div className={classes.imageContainer}>
                <ReactSVG
                  src={faVerified}
                  className={`${classes.notificationIcon} success`}
                />
              </div>
            )}
          </>
        )}
        {!isReseted ? (
          user?.isAuthenticated ? (
            <ResetAuthUser
              handleSuccess={handleResetedSuccess}
              handleFailure={handleResetedFailure}
            />
          ) : (
            <ResetNotAuthUser
              handleSuccess={handleVerificationSuccess}
              handleFailure={handleVerificationFailure}
            />
          )
        ) : (
          <div>
            <h2>Thank you for resetting you password</h2>
            <p className={classes.text}>
              you're password has been reset
              {user?.isAuthenticated ? (
                <span>
                  you can choose either to <Link to="/logout">logout</Link> or
                  to continue your browsing{" "}
                </span>
              ) : (
                <span>you'll be redirected to login in 5 seconds </span>
              )}
            </p>
          </div>
        )}
      </Box>
    </div>
  );
};

export default ResetPassword;
