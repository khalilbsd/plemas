import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { btnStyle } from './style'

const AddBtn = ({handleAdd,title,icon}) => {
  const classes=btnStyle()
  return (
    <div>
        <button className={classes.btn} onClick={handleAdd}>
          <FontAwesomeIcon icon={icon}/>   {title}
        </button>
    </div>
  )
}

export default AddBtn