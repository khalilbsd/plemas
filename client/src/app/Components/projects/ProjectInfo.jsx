import React from "react";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { projectDetails } from "./style";
import { Chip, Grid, Skeleton } from "@mui/material";

const ProjectInfo = ({ loading }) => {
  const project = useGetStateFromStore("project", "projectDetails");
  const classes = projectDetails();

  if (loading || !project)
    return <Skeleton className={classes.mainInfoSkeleton} />;
  return (
    <div className={classes.card}>
      <div className={classes.mainInfo}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h3 className={classes.sectionTitle}>Information générale</h3>
          </Grid>
          {/* start date du projet  */}
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={classes.data}>
                  <p className="label">Date </p>
                  <div className="value">{project.startDate}</div>
                </div>
              </Grid>
              {/* date fin */}
              <Grid item xs={12}>
                <div className={classes.data}>
                  <p className="label">Date Fin</p>
                  <div className="value">
                    {project.dueDate ? project.dueDate : "le project est cours"}
                  </div>
                </div>
              </Grid>
              {/* project phase */}
              <Grid item xs={12}>
                <div className={classes.data}>
                  <p className="label">la Phase</p>
                  <div className="value">{project.phase?.name}</div>
                </div>
              </Grid>
                 {/* projects lot  */}
          <Grid item xs={12}>
            <div className={classes.data}>
              <p className="label">les Lots</p>
              <div className="value">
                {project.projectLots?.map(({ lot }) => (
                  <Chip label={lot?.name} size="medium" />
                ))}
              </div>
            </div>
          </Grid>
          {/* project state  */}
          <Grid item xs={12}>
            <div className={classes.data}>
              <p className="label">l'Etat du projet</p>
              <div className="value">not implemented</div>
            </div>
          </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Grid container spacing={2}>
              {/* manager */}
              <Grid item xs={12}>
                <div className={classes.data}>
                  <p className="label">Chef de project</p>
                  <div className="value">
                    <div className={classes.manager}>
                      {project.managerID?.UserProfile?.image ? (
                        <img
                          src={`${process.env.REACT_APP_SERVER_URL}${project.managerID?.UserProfile?.image}`}
                        />
                      ) : (
                        <span className="initials">
                          {project.managerID?.UserProfile?.name[0]}
                          {project.managerID?.UserProfile?.lastName[0]}
                        </span>
                      )}
                      <p className="manager-name">
                        {project.managerID?.UserProfile?.name}
                        {project.managerID?.UserProfile?.lastName}
                        <br />
                        <span className="email">
                          {project.managerID?.email}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>
              {/* creator */}
              <Grid item xs={12}>
                <div className={classes.data}>
                  <p className="label">Initial créateur projet</p>
                  <div className="value">
                    <div className={classes.manager}>
                      {project.creatorDetails?.UserProfile?.image ? (
                        <img
                          src={`${process.env.REACT_APP_SERVER_URL}${project.creatorDetails?.UserProfile?.image}`}
                        />
                      ) : (
                        <span className="initials">
                          {project.creatorDetails?.UserProfile?.name[0]}
                          {project.creatorDetails?.UserProfile?.lastName[0]}
                        </span>
                      )}
                      <p className="manager-name">
                        {project.creatorDetails?.UserProfile?.name}
                        {project.creatorDetails?.UserProfile?.lastName}
                        <br />
                        <span className="email">
                          {project.creatorDetails?.email}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>
              {/* listee des intervenant  */}
              <Grid item xs={12}>
                <div className={classes.data}>
                  <p className="label">les Intervenants</p>
                  <div className="value">not implemented</div>
                </div>
              </Grid>
            </Grid>
          </Grid>


        </Grid>
      </div>
    </div>
  );
};

export default ProjectInfo;
