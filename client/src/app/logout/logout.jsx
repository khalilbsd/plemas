import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logout } from '../../store/reducers/auth';

const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    try {
      dispatch(logout())

    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  })

  return (
    <div>

    <Typography variant="h4" component="h2">
    We logging you out !
    see you next time
</Typography>
    </div>
  )
}

export default Logout