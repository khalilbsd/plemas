import { TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import useGetStateFromStore from '../../../../../hooks/manage/getStateFromStore'
import { filterProjectsList } from '../../../../../store/reducers/manage.reducer'
import { addUserFormStyles } from '../../style'

const LinkProject = ({label,className,color,size}) => {
    const externalClasses = addUserFormStyles()
    const [phase, setPhase] = useState("")
    const projectState = useGetStateFromStore("manage","addProject")
    const dispatch = useDispatch()
    const filterProjects =(e)=>{

        setPhase(e.target.value)
        if (e.target.value){
          dispatch(filterProjectsList({flag:true,value:e.target.value,attribute:'projectCustomId'}))
        }else{
          dispatch(filterProjectsList({flag:false,value:"",attribute:'projectCustomId'}))

        }
      }



  return (
    <TextField
    className={className?className:externalClasses.inputs}
    label={label?(label === ' '?"":label):"Recherche phase lié"}
    type="text"
    value={projectState.linkedProjectID?projectState.linkedProject:phase}
    id="linkPhase"
    variant="outlined"
    color={color?color:'primary'}
    size={size?size:'medium'}
    onChange={filterProjects}
  />
  )
}

export default LinkProject