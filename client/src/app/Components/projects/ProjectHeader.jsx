import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectByIDMutation } from "../../../store/api/projects.api";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { projectDetails } from "./style";
import { Grid, Skeleton } from "@mui/material";
import { ReactSVG } from "react-svg";
import faUser from "../../public/svgs/light/user.svg";
import { formatDateToCompare,formattedDate } from "../../../store/utils";
const ProjectHeader = ({ loading }) => {
  const project = useGetStateFromStore("project", "projectDetails");
  const classes = projectDetails();




  function compareStartDate (){
    let ch =""
    if (new Date() < formatDateToCompare(project.startDate) ){
      ch = `commence`
  }else {
    ch ="a commencé le"
    }

    return `${ch} ${formattedDate(project.startDate)}`
  }

  if (loading || !project)
    return <Skeleton className={classes.headerSkeleton} />;

  return (
    <div className={classes.card}>
      <div className={classes.projetHeader}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <h1 className={classes.projectTitle}>{project.name}</h1>
            <p className={classes.subTitle}>
              {project.customId}
              <br />
              {compareStartDate()}
            </p>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <div className={classes.kApiContainer}>
              <div className={classes.keyFigure}>
                <div className="content">
                  <p className="value">100</p>
                  <p className="labels">total des heurs</p>
                </div>
                <div className="icon">
                  <ReactSVG src={faUser} />
                </div>
              </div>
              <div className={classes.keyFigure}>
                <div className="content">
                  <p className="value">100</p>
                  <p className="labels">Taches</p>
                </div>
                <div className="icon">
                  <ReactSVG src={faUser} />
                </div>
              </div>
              <div className={classes.keyFigure}>
                <div className="content">
                  <p className="value">100</p>
                  <p className="labels">Intervant</p>
                </div>
                <div className="icon">
                  <ReactSVG src={faUser} />
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>{" "}
    </div>
  );
};

export default ProjectHeader;
