import React from 'react'
import Grid from '@mui/material/Grid';
import { styles } from './style.js';
import logo from '../public/images/logo.webp'
import { Box, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';


const login = () => {
  const classes=styles()
  return (
    <div className={classes.bg}>
     <Box className={classes.loginBox}>
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
          <TextField className={classes.input} id="email" name="email" label="Outlined" variant="outlined" />
        </Grid>
        <Grid item xs={12} lg={12} md={12}>
            <TextField className={classes.input} id="password" label="password" variant="outlined" />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
        <Link to={'reset-password'}>
          Forget Password ?
        </Link>
        </Grid>
        <Grid item xs={12} lg={12} md={12}>
        <Button variant="outlined" >login</Button>
        </Grid>
      </Grid>
     </Box>
    </div>
  )
}

export default login