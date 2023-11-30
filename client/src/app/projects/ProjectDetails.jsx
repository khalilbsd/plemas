import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { NOTIFY_ERROR } from "../../constants/constants";
import { useGetProjectByIDMutation, useProjectGetLogMutation } from "../../store/api/projects.api";
import { setProject, setProjectLog } from "../../store/reducers/project.reducer";
import { clearProjectTasks, setProjectTask } from "../../store/reducers/task.reducer";
import Loading from "../Components/loading/Loading";
import { notify } from "../Components/notification/notification";
import ProjectHeader from "../Components/projects/ProjectHeader";
import ProjectRequests from "../Components/projects/ProjectRequests";
import ProjectTaskAdd from "../Components/projects/ProjectTaskAdd";
import ProjectTasks from "../Components/projects/ProjectTasks";
import { projectDetails } from "../Components/projects/style";
import { useGetProjectTasksMutation } from "../../store/api/tasks.api";
import ProjectLog from "../Components/projects/ProjectLog";

const ProjectDetails = () => {
  const classes = projectDetails();
  const { projectID } = useParams();
  const [getProjectByID, { isLoading }] = useGetProjectByIDMutation();
  const [getProjectTasks] = useGetProjectTasksMutation();
  const [projectGetLog,{isLoading:loadingLog}]= useProjectGetLogMutation()
  const [openLog, setOpenLog] = useState(false)
  const [loadingPage, setLoadingPage] = useState(false);
  const dispatch = useDispatch();
  const [openAddTask, setOpenAddTask] = useState(false);
  const redirect = useNavigate()
  useEffect(() => {


    async function loadProject() {
      try {
        const data = await getProjectByID(projectID).unwrap();
        dispatch(setProject(data?.project));
        const res = await getProjectTasks(projectID).unwrap();
        dispatch(setProjectTask(res?.intervenants));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data.message);
        redirect('/projects')
        return false
      }
    }

    setLoadingPage(true);
    dispatch(clearProjectTasks());
    loadProject();

    setTimeout(() => {
      setLoadingPage(false);
    }, 500);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenTaskAdd = () => {
    setOpenAddTask(true);
  };

  const handleCloseTaskAdd = () => {
    setOpenAddTask(false);
  };


useEffect(() => {
  async function  loadProjectLog(){
    try {
      const log = await  projectGetLog(projectID).unwrap()
      dispatch(setProjectLog(log?.tracking))
    } catch (error) {
      notify(NOTIFY_ERROR,error?.data.message)
    }
  }
  if (openLog){
    loadProjectLog()

  }
}, [openLog, projectID, projectGetLog, dispatch])


  if (isLoading || loadingPage)
    return (
      <div className={classes.projectDetailsPage}>
        <Loading color="var(--dark-green)" />
      </div>
    );



    const handleOpenLogTab=()=>{
      setOpenLog(true)
    }
    const handleCloseLogTab=()=>{
      setOpenLog(false)
    }


  return (
    <div className={classes.projectDetailsPage}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ProjectHeader loading={isLoading} openLogTab={handleOpenLogTab} />
        </Grid>
          <ProjectLog open={openLog} closeLogTab={handleCloseLogTab} loadingLog={loadingLog} />
        {openAddTask && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <ProjectTaskAdd
              loading={isLoading}
              closeAddTask={handleCloseTaskAdd}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ProjectTasks
            loading={isLoading}
            openAddTask={handleOpenTaskAdd}
            closeAddTask={handleCloseTaskAdd}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div className={classes.card}>
            <ProjectRequests loading={isLoading} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProjectDetails;
