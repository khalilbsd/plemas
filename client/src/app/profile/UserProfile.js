import { Card, Grid } from "@mui/material";
import React from "react";

const UserProfile = () => {
  return (
    <div className="profile-page">
      <Grid container spacing={2} justifyContent="space-around">
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <Card >
            profile image
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={8}>
          <Card>
          proflel into

          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserProfile;
