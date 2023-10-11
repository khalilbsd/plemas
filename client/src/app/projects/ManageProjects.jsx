import { Grid, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { projectsStyles } from '../Components/managing/style'
import ProjectList from '../Components/managing/ProjectList'
import { useDispatch } from 'react-redux'
import { useGetProjectListMutation } from '../../store/api/projects.api'
import { notify } from '../Components/notification/notification'
import { NOTIFY_ERROR } from '../../constants/constants'
import useGetStateFromStore from '../../hooks/manage/getStateFromStore'
import { setProjectList } from '../../store/reducers/manage.reducer'

const ManageProjects = () => {
  const projects = useGetStateFromStore('manage','projectsList')
  const dispatch = useDispatch()
  const [getProjectList,{isLoading}]= useGetProjectListMutation()

  useEffect(() => {
    async function loadProjects(){
      try {
        const data = await getProjectList().unwrap()
        console.log(data);
        dispatch(setProjectList(data.projects))
      } catch (error) {
        notify(NOTIFY_ERROR,error?.data?.message)
      }

    }

    loadProjects()
  }, [])

  console.log(projects);

  const classes=projectsStyles()
  return (
    <div className={classes.projectsPage}>

   <Grid container spacing={2} sx={{height:'100%'}}>
    <Grid item xs={12} lg={12}>
      <div className="page-title">
        <h1>Projects</h1>
      </div>
    </Grid>
    <Grid item xs={12} lg={12}>
        <TextField
          variant='outlined'
          name="search"
          label="Search"
          size='small'
          className={classes.searchField}
        />
    </Grid>
    <Grid item xs={12} lg={12}>
      <ProjectList projects ={projects} />
    </Grid>
   </Grid>
   </div>

  )
}

export default ManageProjects