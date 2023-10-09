import React from 'react'
import {style} from './style.js'
import ClipLoader from "react-spinners/ClipLoader";

const Loading = ({color="#754619"}) => {
    const classes = style()
  return (
    <div className={classes.loaderContainer}>
    <ClipLoader color={color} />
  </div>
  )
}

export default Loading