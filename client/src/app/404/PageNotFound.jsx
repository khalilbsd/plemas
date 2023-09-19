import React from 'react'
import image404 from '../public/images/404.png'
import { styles } from './style'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'



const PageNotFound = () => {
  const classes = styles()
  return (
    <div className={classes.pageNotFound}>
      <Box className={classes.box}>
      <h6>OOPS Page not found</h6>
      <div className={classes.imageContainer}>
      <img src={image404} alt="404 " />
      </div>
      <h6>We're sorry but the page you requested was not found</h6>
      <Link to='/'>
        Go  home
      </Link>
      </Box>
    </div>
  )
}

export default PageNotFound