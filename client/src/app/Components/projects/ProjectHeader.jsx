import { Grid, Skeleton } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { setProjectPriority } from "../../../store/reducers/project.reducer";
import faChevronDown from "../../public/svgs/light/chevron-down.svg";
import faChevronUp from "../../public/svgs/light/chevron-up.svg";
import PriorityField, {
  priorityColors
} from "../managing/projects/addProject/PriorityField";
import ProjectInfo from "./ProjectInfo";
import { projectDetails } from "./style";
const ProjectHeader = ({ loading }) => {
  const project = useGetStateFromStore("project", "projectDetails");
  const edit = useGetStateFromStore("project", "edit");
  const classes = projectDetails();
  const [details, setDetails] = useState(false);
  const [priorityChange, setPriorityChange] = useState(false);
  const dispatch = useDispatch();
  const getPriorityColor = (id) => {
    const priority = priorityColors.filter((color) => color.value === id)[0];
    if (!priority) return { code: "var(--bright-orange)", value: -1 };

    return { code: priority.code, value: priority.value };
  };

  const openDetails = () => {
    setDetails(true);
  };
  const closeDetails = () => {
    setDetails(false);
  };

  if (loading || !project)
    return <Skeleton className={classes.headerSkeleton} />;

  const changePriority = (e) => {
    setPriorityChange((prevPrio) => !prevPrio);
  };

  const handleUpdatePriority = (priority) => {
    dispatch(setProjectPriority(parseInt(priority)));
  };

  return (
    <div className={`${classes.card} ${details ? "colored" : ""}`}>
      <div className={classes.projetHeader}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ padding: "15px 20px" }}
        >
          <Grid item xs={6} sm={6} md={5} lg={7} xl={9}>
            <h1 className={classes.projectTitle}>{project.customId}</h1>
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={2} xl={1}>
            <div className={`headerInfo ${!details ? "hidden" : "collapsed"}`}>
              {project.prevPhase && (
                <>
                  Phase lié <br />
                  <Link to={`/projects/${project?.prevPhase}`} target="_blank">
                    {project?.project.name} {project?.project?.phase?.name}
                  </Link>
                </>
              )}
            </div>
          </Grid>
          <Grid item xs={3} sm={3} md={2} lg={1} xl={1}>
            <div className={`headerInfo ${!details ? "hidden" : "collapsed"}`}>
              {project?.priority !== undefined && (
                <div
                  onClick={edit ? changePriority : undefined}
                  data-priority={getPriorityColor(project.priority)?.value}
                  className={classes.priority}
                >
                  <div
                    style={{
                      backgroundColor: getPriorityColor(project.priority).code
                    }}
                    className="circle"
                  ></div>
	
                  {priorityChange && (
                    <div className={classes.priorityUpdateContainer}>
                      <PriorityField
                        onChange={handleUpdatePriority}
                        priority={getPriorityColor(project.priority).value}
                      />
                    </div>
                  )}
                </div>
              )}
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

      <ProjectInfo
        handleClose={closeDetails}
        open={details}
        loading={loading}
      />
    </div>
  );
};

export default ProjectHeader;
