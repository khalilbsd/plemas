import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { NOTIFY_ERROR } from "../../constants/constants";
import { useGetProjectByIDMutation } from "../../store/api/projects.api";
import { setProject } from "../../store/reducers/project.reducer";
import { clearProjectTasks, setProjectTask } from "../../store/reducers/task.reducer";
import Loading from "../Components/loading/Loading";
import { notify } from "../Components/notification/notification";
import ProjectHeader from "../Components/projects/ProjectHeader";
import ProjectRequests from "../Components/projects/ProjectRequests";
import ProjectTaskAdd from "../Components/projects/ProjectTaskAdd";
import ProjectTasks from "../Components/projects/ProjectTasks";
import { projectDetails } from "../Components/projects/style";
import { useGetProjectTasksMutation } from "../../store/api/tasks.api";

const ProjectDetails = () => {
  const classes = projectDetails();
  const { projectID } = useParams();
  const [getProjectByID, { isLoading }] = useGetProjectByIDMutation();
  const [getProjectTasks] = useGetProjectTasksMutation();

  const [loadingPage, setLoadingPage] = useState(false);
  const dispatch = useDispatch();
  const [openAddTask, setOpenAddTask] = useState(false);
  useEffect(() => {
    async function loadProjectTasks() {
      try {
        const res = await getProjectTasks(projectID).unwrap();
        dispatch(setProjectTask(res?.intervenants));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
      }
    }


    async function loadProject() {
      try {
        const data = await getProjectByID(projectID).unwrap();
        dispatch(setProject(data?.project));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data.message);
      }
    }
    setLoadingPage(true);
    dispatch(clearProjectTasks());
    loadProject();
    loadProjectTasks();
    setTimeout(() => {
      setLoadingPage(false);
    }, 500);

  }, [projectID,getProjectByID,dispatch]);

  const handleOpenTaskAdd = () => {
    setOpenAddTask(true);
  };

  const handleCloseTaskAdd = () => {
    setOpenAddTask(false);
  };

  if (isLoading || loadingPage)
    return (
      <div className={classes.projectDetailsPage}>
        <Loading color="var(--dark-green)" />
      </div>
    );

  return (
    <div className={classes.projectDetailsPage}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ProjectHeader loading={isLoading} />
        </Grid>
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
