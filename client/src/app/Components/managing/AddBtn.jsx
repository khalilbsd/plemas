import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { btnStyle } from './style'
import { ReactSVG } from 'react-svg'
import Loading from '../loading/Loading'
const AddBtn = ({handleAdd,title,icon,loading}) => {
  const classes=btnStyle()
  return (
    <div>
        <button className={classes.btn} onClick={handleAdd} disabled={loading?true:false}>
         {
          !loading?
          <>
           <ReactSVG src={icon} className={classes.icon}/>   {title}
          </>
          :
          <Loading  color='var(--orange)'/>
         }
        </button>
    </div>
  )
}

export default AddBtn