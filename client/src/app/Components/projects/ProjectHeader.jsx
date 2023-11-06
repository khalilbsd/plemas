import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { setProject, setProjectPriority } from "../../../store/reducers/project.reducer";
import faChevronDown from "../../public/svgs/light/chevron-down.svg";
import faChevronUp from "../../public/svgs/light/chevron-up.svg";
import PriorityField, {
  priorityColors
} from "../managing/projects/addProject/PriorityField";
import ProjectInfo from "./ProjectInfo";
import { projectDetails } from "./style";
import faSearch from "../../public/svgs/light/magnifying-glass.svg";
import faCancel from "../../public/svgs/light/xmark.svg";
import { useGetProjectByIDMutation, useGetProjectListMutation } from "../../../store/api/projects.api";
import { setProjectList } from "../../../store/reducers/manage.reducer";
import { NOTIFY_ERROR } from "../../../constants/constants";
import { notify } from "../notification/notification";
import { setProjectTask } from "../../../store/reducers/task.reducer";
import { useGetProjectTasksMutation } from "../../../store/api/tasks.api";
const ProjectHeader = ({ loading }) => {
  const project = useGetStateFromStore("project", "projectDetails");
  const projectList = useGetStateFromStore("manage", "projectsList");
  const edit = useGetStateFromStore("project", "edit");
  const classes = projectDetails();
  const [details, setDetails] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [priorityChange, setPriorityChange] = useState(false);
  const [getProjectList] = useGetProjectListMutation();
  const [getProjectByID] = useGetProjectByIDMutation();
  const [getProjectTasks] = useGetProjectTasksMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjectList().unwrap();
        dispatch(
          setProjectList({ projects: data.projects, tasks: data.projectsTasks })
        );
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
      }
    }
    if (toggleSearch && !projectList.length) {
      loadProjects();
    }
  }, [toggleSearch]);




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

  const enableSearch = () => {
    setToggleSearch(true);
  };
  const disableSearch = () => {
    setToggleSearch(false);
  };

  const handleChangeSearch = (e) => {
    async function loadProjectTasks() {
      try {
        const res = await getProjectTasks(e.target.value).unwrap();
        dispatch(setProjectTask(res?.intervenants));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
      }
    }

    async function loadProjects() {
      try {
        const data = await getProjectByID(e.target.value).unwrap();
        dispatch(setProject(data?.project));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data.message);
      }
    }
    loadProjects()
    loadProjectTasks()
  };


  return (
    <div className={`${classes.card} transparent`}>
      <div className={classes.projectHeader}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ padding: "15px 20px" }}
        >
          <Grid item xs={6} sm={6} md={5} lg={7} xl={9}>
            <div className={classes.searchProjectByTitle}>
              {!toggleSearch ? (
                <h1 className={classes.projectTitle}>{project.customId}</h1>
              ) : (
                !projectList.length?
                  <Skeleton />
                :
                <FormControl className={classes.search}>
                  <InputLabel id="Recherche-label">Recherche</InputLabel>
                  <Select
                    labelId="dRecherche-label"
                    id="recherche"
                    value={project.id}
                    label="Recherche"
                    name="search"
                    onChange={handleChangeSearch}
                  >
                    {projectList.map(projectName=>(
                      <MenuItem value={projectName.id}>{projectName.projectCustomId}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <button
                onClick={!toggleSearch ? enableSearch : disableSearch}
                className="search"
              >
                <ReactSVG src={!toggleSearch ? faSearch : faCancel} />
              </button>
            </div>
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
