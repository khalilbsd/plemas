import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom'
import useGetAuthenticatedUser from '../../hooks/authenticated'
import { toggleSideBar } from '../../store/reducers/sidebar.reducer'
import { combinedUrls } from '../routes/urls'
import { styles } from './style'

const PageNotFound = () => {
  const classes = styles()
  const dispatch = useDispatch()
  const {user} = useGetAuthenticatedUser()
  const navigate = useNavigate()
  const location  = useLocation()

  const isPathValid = () => {
    // Check if location.pathname matches any valid path
    return combinedUrls.filter(path=>path !== '*' && path!=='/').some((path) => {
      return matchPath({ path:path, exact: true },location.pathname ) !== null;
    });
  };

  useEffect(() => {
    dispatch(toggleSideBar(true))
    if ((!user || !user?.isAuthenticated) && isPathValid()){
      navigate('/login')
    }
  },[user])

  return (
    <div className={classes.pageNotFound}>
      <Box className={classes.box}>
      <div className='number'>404</div>
      <div className='message'>Opps ! page non trouvée. vous pouvez aller sur votre page
    {" "}
      <Link to='/'>

      d'accueil
      </Link>
      </div>
      </Box>
    </div>
  )
}

export default PageNotFound