import { Grid, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { projectsStyles } from '../Components/managing/style'
import ProjectList from '../Components/managing/projects/ProjectList'
import { useDispatch } from 'react-redux'
import { useGetProjectListMutation } from '../../store/api/projects.api'
import { notify } from '../Components/notification/notification'
import { NOTIFY_ERROR } from '../../constants/constants'
import useGetStateFromStore from '../../hooks/manage/getStateFromStore'
import { setProjectList } from '../../store/reducers/manage.reducer'
import AddProject from '../Components/managing/projects/AddProject'
import { ToastContainer } from 'react-toastify'

const ManageProjects = () => {
  const projects = useGetStateFromStore('manage','projectsList')
  const dispatch = useDispatch()
  const [getProjectList,{isLoading}]= useGetProjectListMutation()

  async function loadProjects(){
    try {
      const data = await getProjectList().unwrap()

      dispatch(setProjectList(data.projects))
    } catch (error) {
      notify(NOTIFY_ERROR,error?.data?.message)
    }

  }
  useEffect(() => {
    loadProjects()
  }, [])



  const classes=projectsStyles()
  return (
    <div className={classes.projectsPage}>

   <Grid container alignItems="center" spacing={2} sx={{height:'100%'}}>
    <Grid item xs={12} md={4} lg={2}>
      <div className="page-title">
        <h1>Projets</h1>
      </div>
    </Grid>
    <Grid item xs={12} md={8} lg={10}>
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
    <Grid item xs={12} lg={12}>
      <AddProject refreshProjects={loadProjects}/>
    </Grid>
   </Grid>
   <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
   />
   </div>

  )
}

export default ManageProjects