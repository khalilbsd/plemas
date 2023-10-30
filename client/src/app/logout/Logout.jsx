import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logout } from '../../store/reducers/auth';
import { clearManageList } from '../../store/reducers/manage.reducer';

const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    try {
      dispatch(logout())
      dispatch(clearManageList())

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
    Nous vous déconnectons ! à la prochaine fois
</Typography>
    </div>
  )
}

export default Logout