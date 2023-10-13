import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { btnStyle } from './style'
import { ReactSVG } from 'react-svg'
const AddBtn = ({handleAdd,title,icon}) => {
  const classes=btnStyle()
  return (
    <div>
        <button className={classes.btn} onClick={handleAdd}>
          <ReactSVG src={icon} className={classes.icon}/>   {title}
        </button>
    </div>
  )
}

export default AddBtn