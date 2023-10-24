import { Grid, Skeleton } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import faChevronDown from "../../public/svgs/light/chevron-down.svg";
import faChevronUp from "../../public/svgs/light/chevron-up.svg";
import { priorityColors } from "../managing/projects/addProject/PriorityField";
import ProjectInfo from "./ProjectInfo";
import { projectDetails } from "./style";
const ProjectHeader = ({ loading }) => {
  const project = useGetStateFromStore("project", "projectDetails");
  const classes = projectDetails();
  const [details, setDetails] = useState(true);

  // function compareStartDate (){
  //   let ch =""
  //   if (new Date() < formatDateToCompare(project.startDate) ){
  //     ch = `commence`
  // }else {
  //   ch ="a commencé le"
  //   }

  //   return `${ch} ${formattedDate(project.startDate)}`
  // }

  const getPriorityColor =(id)=>{
    const priority = priorityColors.filter(color=>color.value === id)[0]
    if (!priority) return 'var(--bright-orange)'
    return priority.code

  }

  const openDetails = () => {
    setDetails(true);
  };
  const closeDetails = () => {
    setDetails(false);
  };

  if (loading || !project)
    return <Skeleton className={classes.headerSkeleton} />;

  return (
    <div className={`${classes.card} ${details?'colored':""}`}>
      <div className={classes.projetHeader}>
        <Grid container spacing={2} alignItems="center" sx={{padding:'15px 20px'}}>
          <Grid item xs={6} sm={6} md={5} lg={7} xl={9}>
            <h1 className={classes.projectTitle}>
              {project.customId}
            </h1>
          </Grid>
         <Grid item xs={3} sm={3} md={3} lg={2} xl={1} >

         <div className={`headerInfo ${!details?'hidden':'collapsed'}`}>
         {project.prevPhase&&
            <>
            Phase lié <br/>
            <Link to={`/projects/${project?.prevPhase}`} target="_blank" >
              {project?.project.name} {project?.project?.phase?.name}
            </Link>
            </>
          }
          </div>
          </Grid>
          <Grid item xs={3} sm={3} md={2} lg={1} xl={1} >
          <div className={`headerInfo ${!details?'hidden':'collapsed'}`}>

          {project?.priority&&
            <div className={classes.priority}>
              <div style={{backgroundColor:getPriorityColor(project.priority)}} className="circle"></div>
            </div>
          }
          </div>
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} xl={1}>
            {!details ? (
              <button onClick={openDetails} className={classes.seeMoreProject}>
                Voir plus <ReactSVG src={faChevronDown} />
              </button>
            ) : (
              <button onClick={closeDetails} className={classes.seeMoreProject}>
                Voir moin <ReactSVG src={faChevronUp} />
              </button>
            )}
          </Grid>

        </Grid>
      </div>

      <ProjectInfo open={details} loading={loading} />
    </div>
  );
};

export default ProjectHeader;
