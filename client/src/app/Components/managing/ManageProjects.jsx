import { Grid, TextField } from '@mui/material'
import React from 'react'
import { projectsStyles } from './style'
import ProjectList from './ProjectList'

const ManageProjects = () => {


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
      <ProjectList />
    </Grid>
   </Grid>
   </div>

  )
}

export default ManageProjects