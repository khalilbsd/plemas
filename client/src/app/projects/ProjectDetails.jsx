import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import { projectDetails } from "../Components/projects/style";
import ProjectHeader from "../Components/projects/ProjectHeader";
import ProjectTasks from "../Components/projects/ProjectTasks";
import ProjectRequests from "../Components/projects/ProjectRequests";
import { useGetProjectByIDMutation } from "../../store/api/projects.api";
import { useParams } from "react-router";
import { notify } from "../Components/notification/notification";
import { NOTIFY_ERROR } from "../../constants/constants";
import { useDispatch } from "react-redux";
import { setProject } from "../../store/reducers/project.reducer";
import ProjectInfo from "../Components/projects/ProjectInfo";

const ProjectDetails = () => {
  const classes = projectDetails();
  const { projectID } = useParams();
  const [getProjectByID, { isLoading }] = useGetProjectByIDMutation();
  console.log(projectID);
  const dispatch = useDispatch();
  useEffect(() => {
    async function loadProject() {
      try {
        const data = await getProjectByID(projectID).unwrap();

        dispatch(setProject(data?.project));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data.message);
      }
    }

    loadProject();
  }, [projectID]);

  return (
    <div className={classes.projectDetailsPage}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ProjectHeader loading={isLoading} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={12}>
              <ProjectInfo loading={isLoading} />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={12}>
              <div className={classes.card}>
                <ProjectRequests loading={isLoading} />
              </div>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={6}>
          <div className={classes.card}>
            <ProjectTasks loading={isLoading} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProjectDetails;
