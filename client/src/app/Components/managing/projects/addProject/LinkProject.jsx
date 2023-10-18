import React, { useState } from 'react'
import { addUserFormStyles, projectsStyles } from '../../style'
import { TextField } from '@mui/material'
import { filterProjectsList } from '../../../../../store/reducers/manage.reducer'
import { useDispatch } from 'react-redux'
import useGetStateFromStore from '../../../../../hooks/manage/getStateFromStore'

const LinkProject = () => {
    const externalClasses = addUserFormStyles()
    const [phase, setPhase] = useState("")
    const projectState = useGetStateFromStore("manage","addProject")
    const dispatch = useDispatch()
    const filterProjects =(e)=>{
        setPhase(e.target.value)
        dispatch(filterProjectsList({value:e.target.value}))
      }



  return (
    <TextField
    className={externalClasses.inputs}
    label="Recherche phase lié"
    type="text"
    value={projectState.linkedProjectID?projectState.linkedProject:phase}
    id="linkPhase"
    variant="outlined"
    onChange={filterProjects}
  />
  )
}

export default LinkProject