import { Grid, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
  //modal
  import Backdrop from "@mui/material/Backdrop";

  import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { CLIENT_ROLE, EMPLOYEE_ROLE, SUPERUSER_ROLE } from "../../../constants/roles";
import { addUserFormStyles } from "./style";
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  };

const AddUserForm = ({ open, handleClose, handleSubmit,changeStateAccount,changeStateProfile }) => {
    const classes = addUserFormStyles();



    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Add a user
            </Typography>
            <form onSubmit={handleSubmit} method="POST">
              <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>
                  <TextField
                    className={classes.inputs}
                    label="Email"
                    name="email"
                    type="email"
                    variant="outlined"
                    onChange={changeStateAccount}
                    required
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    className={classes.inputs}
                    label="First Name"
                    name="name"
                    type="text"
                    variant="outlined"
                    onChange={changeStateProfile}
                    required
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    className={classes.inputs}
                    label="Last Name"
                    name="lastName"
                    type="text"
                    variant="outlined"
                    onChange={changeStateProfile}
                    required
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    className={classes.inputs}
                    label="phone"
                    type="phone"
                    name='phone'
                    variant="outlined"
                    onChange={changeStateProfile}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormControl  className={classes.inputs} sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      role
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      defaultValue={EMPLOYEE_ROLE}
                      label="Role"
                      name="role"
                      onChange={changeStateAccount}
                    >
                      <MenuItem value={EMPLOYEE_ROLE}>
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={SUPERUSER_ROLE}>Admin</MenuItem>
                      <MenuItem value={CLIENT_ROLE}>Client</MenuItem>
                      <MenuItem value={EMPLOYEE_ROLE}>Employee</MenuItem>
                    </Select>
                    <FormHelperText>The role of user in the application.if no role has been selected to user will default to the employee role
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <button type="submit">add user</button>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <button type="button" onClick={handleClose}>
                    close
                  </button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Fade>
      </Modal>
    );
  };


  export default AddUserForm