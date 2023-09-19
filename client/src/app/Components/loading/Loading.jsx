import React from 'react'
import {style} from './style.js'
import ClipLoader from "react-spinners/ClipLoader";

const Loading = () => {
    const classes = style()
  return (
    <div className={classes.loaderContainer}>
    <ClipLoader color="#754619" />
  </div>
  )
}

export default Loading