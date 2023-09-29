import React from "react";
import { styles } from "./style";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import useGetAuthenticatedUser from "../../hooks/authenticated";
import Loading from "../Components/loading/Loading";
import ResetAuthUser from "../Components/reset_password/ResetAuthUser";
import ResetNotAuthUser from "../Components/reset_password/ResetNotAuthUser";

const ResetPassword = () => {
  const classes = styles();
  const user = useGetAuthenticatedUser();

  if (user.loading) return <Loading />;

  return (
    <div className={classes.resetPasswordPage}>
      <Box className={classes.box}>
        <h2 className={classes.pageTitle}>
          Reset your password
        </h2>
        <h3 className={classes.text} >
          you can reset you password here{" "}
        </h3>
        {user?.isAuthenticated ? <ResetAuthUser /> : <ResetNotAuthUser />}
      </Box>
    </div>
  );
};

export default ResetPassword;
