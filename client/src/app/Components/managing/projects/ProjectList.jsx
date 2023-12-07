import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import { setLinkedProject } from "../../../../store/reducers/manage.reducer";
import { projectsStyles } from "../style";
// import { projectTestList } from "./test/projectList.test";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { TableVirtuoso } from "react-virtuoso";
import {
  TASK_STATE_BLOCKED,
  TASK_STATE_DOING,
  TASK_STATE_TRANSLATION,
  progress_bar_width_cell
} from "../../../../constants/constants";
import useIsUserCanAccess from "../../../../hooks/access";
import { formattedDate } from "../../../../store/utils";
import faAdd from "../../../public/svgs/solid/plus.svg";
import { CustomCancelIcon, CustomPlusIcon } from "../../icons";
import { projectTaskDetails } from "../../projects/style";
import ProjectListHeader from "./ProjectListHeader";
import LinkProject from "./addProject/LinkProject";
import { priorityColors } from "./addProject/PriorityField";
import ActiveFilters from "./filter/ActiveFilters";
import ExportActions from "./ExportActions";

const ProjectList = ({ addForm, handleForm, loadingProjectList }) => {
  const classes = projectsStyles();
  const tasksStyles = projectTaskDetails();

  const { isSuperUser, isManager } = useIsUserCanAccess();
  const projects = useGetStateFromStore("manage", "projectsList");
  const tasks = useGetStateFromStore("manage", "projectsTaskList");
  const tasksFiltered = useGetStateFromStore("manage", "projectsTaskListFiltered");
  const twoWeeksDates = useGetStateFromStore("project", "twoWeeksList");
  const colors = useGetStateFromStore("userInfo", "avatarColors");
  const filterTaskState = useGetStateFromStore("manage", "projectsTaskFilters");

  const addProjectState = useGetStateFromStore("manage", "addProject");
  const [projectToCollapse, setProjectToCollapse] = useState(undefined);

  const navigate = useNavigate();

  // const [emptyMessage, setEmptyMessage] = useState("");

  const dispatch = useDispatch();
  const getPriorityColor = (id) => {
    const priority = priorityColors.filter((color) => color.value === id)[0];
    if (!priority) return { code: "var(--bright-orange)", value: -1 };

    return { code: priority.code, value: priority.value };
  };
  const projectList = () => {
    if (addForm || addProjectState.isFiltering) {
      return addProjectState.projectsListFiltered;
    }
    return projects.filter((project) =>
      [TASK_STATE_DOING, TASK_STATE_BLOCKED].includes(project.state)
    );
  };

  function projectTasks(projectID) {
    let projTasks = tasksFiltered.length ? tasksFiltered : tasks
    const projectTasksList = projTasks?.filter(
      (item) => item.projectID === projectID
    );
    if (!projectTasksList) return [];

    return projectTasksList[0]?.tasks.filter((task) => {
      return filterTaskState.length
        ? filterTaskState.includes(
            TASK_STATE_TRANSLATION.filter((t) => t.label === task.state)[0]
              ?.value
          )
        : true;
    });
  }

  const isProjectCollapsed = (id) => {
    if (projectToCollapse === id) return true;
    return false;
  };

  function convertTwoWeeksDates() {
    return twoWeeksDates?.map(({ date }) => {
      return date.split(" ")[1];
    });
  }

  const handleNavigation = (rowID) => {
    navigate(`/projects/${rowID}`);
  };

  const handleClickProject = (rowID) => {
    dispatch(setLinkedProject(rowID));
    const elements = document.querySelectorAll(".row-data");
    elements.forEach((element) => {
      element.classList.remove("active");
    });
  };

  const renderProjectTasks = (projectID) => {
    const tasksNb = projectTasks(projectID)?.length;
    if (!tasksNb)
      return (
        <p className={classes.emptyTasks}>
          {" "}
          il n'y a pas de tâches planifiées{" "}
        </p>
      );
    const taskInfoElement = tasksNb ? (
      projectTasks(projectID)?.map((task) => {
        return (
          <div key={task.id} className={classes.taskStates}>
            <Tooltip key={task.id} title={task?.name}>
              <span>{task?.name}</span>
            </Tooltip>
          </div>
        );
      })
    ) : (
      <p className={classes.emptyTasks}> il n'y a pas de tâches planifiées </p>
    );

    if (tasksNb > 1 && isProjectCollapsed(projectID))
      return <div className={classes.task}>{taskInfoElement}</div>;
    if (taskInfoElement.length)
      return <div className={classes.task}>{taskInfoElement?.shift()}</div>;
  };

  const renderTasksStates = (projectID) => {
    let tasksNb = projectTasks(projectID)?.length;
    if (!tasksNb) return null;
    const taskStateElement = tasksNb ? (
      projectTasks(projectID)?.map((task) => {
        return (
          <div key={task.id} className={classes.taskStates}>
            <span className={`${tasksStyles.task} ${task.state} wb`}>
              {
                TASK_STATE_TRANSLATION.filter(
                  (state) => state.label === task.state
                )[0]?.value
              }
            </span>
          </div>
        );
      })
    ) : (
      <span></span>
    );

    if (tasksNb > 1 && isProjectCollapsed(projectID))
      return <div>{taskStateElement}</div>;

    if (taskStateElement?.length) return <div>{taskStateElement?.shift()}</div>;
  };

  const renderTaskTimeLine = (projectID) => {
    const convertedDates = convertTwoWeeksDates();

    // console.log(convertedDates);
    const taskElements = projectTasks(projectID)?.map((task) => {
      // Perform calculations here
      let { startDate, dueDate, doneDate, blockedDate } = task;

      //converting dates
      let start = formattedDate(startDate, true);
      let due = formattedDate(dueDate, true);
      let done = null;
      let blocked = null;
      if (doneDate) done = formattedDate(doneDate, true);
      if (blockedDate) blocked = formattedDate(blockedDate, true);

      let startIdx = convertedDates.findIndex((date) => date === start);
      let dueIdx = convertedDates.findIndex((date) => date === due);
      let doneIdx = convertedDates.findIndex((date) => date === done);
      let blockedIdx = convertedDates.findIndex((date) => date === blocked);
      let width = 0;
      let widthD = 0;
      let widthB = 0;
      let position = 0;

      if (startIdx === -1 && dueIdx === -1) {
        let startConverted = dayjs(start, "DD/MM/YYYY");
        let dueConverted = dayjs(due, "DD/MM/YYYY");

        let blockedConverted = blocked ? dayjs(blocked, "DD/MM/YYYY") : null;
        let doneConverted = done ? dayjs(done, "DD/MM/YYYY") : null;

        if (
          startConverted < dayjs(new Date()) &&
          dueConverted > dayjs(new Date())
        ) {
          width = twoWeeksDates.length * progress_bar_width_cell;
          position = 0;
          if (blocked) {
            widthB =
              blockedIdx > -1
                ? blockedIdx
                  ? progress_bar_width_cell * blockedIdx
                  : progress_bar_width_cell * 1
                : blockedConverted >
                  dayjs(
                    convertTwoWeeksDates[convertTwoWeeksDates.length - 1],
                    "DD/MM/YYYY"
                  )
                ? width
                : 0;
          }
          if (done) {
            widthD =
              doneIdx > -1
                ? doneIdx
                  ? progress_bar_width_cell * doneIdx
                  : progress_bar_width_cell * 1
                : doneConverted >
                  dayjs(
                    convertTwoWeeksDates[convertTwoWeeksDates.length - 1],
                    "DD/MM/YYYY"
                  )
                ? width
                : 0;
          }
        }
      } else {
        position = startIdx !== -1 ? startIdx * progress_bar_width_cell : 0;
        let diff = startIdx > -1 ? startIdx : 0;
        width =
          dueIdx !== -1
            ? dueIdx
              ? (dueIdx - diff) * progress_bar_width_cell
              : 1 * progress_bar_width_cell
            : (convertedDates.length - startIdx) * progress_bar_width_cell;
        if (blocked) {
          widthB =
            blockedIdx !== -1
              ? blockedIdx
                ? (blockedIdx - diff) * progress_bar_width_cell
                : 1 * progress_bar_width_cell
              : (convertedDates.length - startIdx) * progress_bar_width_cell;

          console.log("last width b blockedIDX", blockedIdx, widthB);
        }

        if (done) {
        let doneConverted = done ? dayjs(done, "DD/MM/YYYY") : null;

          widthD =
            doneIdx !== -1
              ? doneIdx
                ? (doneIdx - diff) * progress_bar_width_cell
                : 1 * progress_bar_width_cell
              :
              doneConverted >
                  dayjs(
                    convertTwoWeeksDates[convertTwoWeeksDates.length - 1],
                    "DD/MM/YYYY"
                  )
               ?

              (convertedDates.length - startIdx) * progress_bar_width_cell
              :
              0

        }
      }

      return (
        <div
          data-date={task.dueDate}
          key={task.id}
          style={{ width: width, transform: `translateX(${position}px)` }}
          className={classes.progressBarContainer}
        >
          <span className={classes.progressBar}>
            <span className="date">
              {dayjs(task.dueDate).locale("fr").format("dddd DD/MM/YYYY ")}
            </span>
          </span>
          {doneDate ? (
            <span
              style={{ width: widthD }}
              className={`${classes.progressBar} done-bar`}
            >
              {" "}
            </span>
          ) : blockedDate ? (
            <span
              style={{ width: widthB }}
              className={`${classes.progressBar} blocked-bar`}
            >
              {" "}
            </span>
          ) : null}
        </div>
      );
    });
    const tasksNb = projectTasks(projectID)?.length;

    if (tasksNb > 1 && isProjectCollapsed(projectID))
      return <div>{taskElements}</div>;

    if (taskElements?.length) return <div>{taskElements?.shift()}</div>;
  };

  const renderSeeMoreTaskBtn = (projectID) => {
    const renderActions = [];
    // console.log(row)
    const tasksNb = projectTasks(projectID)?.length;
    // console.log(tasks);
    if (tasksNb > 1 && !isProjectCollapsed(projectID)) {
      renderActions.push(
        <Tooltip key={`${projectID}-exp`} title="voir plus tache">
          <button
            onClick={() => setProjectToCollapse(projectID)}
            className={classes.seeMoreBtn}
          >
            <CustomPlusIcon className={tasksStyles.icon} />
          </button>
        </Tooltip>
      );
    } else if (tasksNb > 1) {
      renderActions.push(
        <Tooltip key={`${projectID}-hid`} title="voir plus tache">
          <button
            onClick={() => setProjectToCollapse(undefined)}
            className={classes.seeMoreBtn}
          >
            <CustomCancelIcon className={tasksStyles.icon} />
          </button>
        </Tooltip>
      );
    }

    return renderActions;
  };

  function rowContent(_index, row) {
    return (
      <React.Fragment>
        <TableCell
          onClick={() =>
            addProjectState.isFiltering && addForm
              ? handleClickProject(row.id)
              : handleNavigation(row.id)
          }
          key={_index}
          className={classes.rowCell}
          component="th"
          scope="row"
        >
          <Tooltip key={_index} title={row?.projectCustomId}>
            <p className={classes.projectName}>
              <span
                className="priority"
                style={{
                  backgroundColor: getPriorityColor(row.priority).code
                }}
              ></span>

              {row?.projectCustomId}
            </p>
          </Tooltip>
        </TableCell>
        <TableCell
          onClick={() =>
            addProjectState.isFiltering && addForm
              ? handleClickProject(row.id)
              : handleNavigation(row.id)
          }
          key={_index + 1}
          className={classes.rowCell}
        >
          <Tooltip title={row.manager.fullName} arrow>
            {row.manager.image ? (
              <div className={classes.managerContainer}>
                <img
                  className={classes.avatar}
                  src={`${process.env.REACT_APP_SERVER_URL}${row.manager.image}`}
                  alt={`manager ${row.manager.fullName} avatar`}
                />
              </div>
            ) : (
              <div className={classes.managerContainer}>
                <span
                  className={`${classes.avatar} ${
                    colors[row.id % colors?.length]
                  }`}
                >
                  {row.manager?.fullName[0]?.toUpperCase()}
                  {row.manager?.fullName.split(" ")[1][0].toUpperCase()}
                </span>
              </div>
            )}
          </Tooltip>
        </TableCell>
        <TableCell
          onClick={() =>
            addProjectState.isFiltering && addForm
              ? handleClickProject(row.id)
              : handleNavigation(row.id)
          }
          key={_index + 2}
          className={classes.rowCell}
        >
          <div className={classes.lots}>
            {row.lots.map((content) => (
              <p key={content} className={classes.lot} label={content}>
                {content}
              </p>
            ))}
          </div>
        </TableCell>
        <TableCell key={_index + 3} className={classes.rowCell}>
          {row?.activePhase}
        </TableCell>
        <TableCell
          onClick={() =>
            addProjectState.isFiltering && addForm
              ? handleClickProject(row.id)
              : handleNavigation(row.id)
          }
          className={classes.rowCell}
        >
          {renderProjectTasks(row.id)}
        </TableCell>
        <TableCell
          onClick={() =>
            addProjectState.isFiltering && addForm
              ? handleClickProject(row.id)
              : handleNavigation(row.id)
          }
          key={_index + 4}
          className={classes.rowCell}
        >
          {renderTasksStates(row.id)}
        </TableCell>
        <TableCell
          onClick={() =>
            addProjectState.isFiltering && addForm
              ? handleClickProject(row.id)
              : handleNavigation(row.id)
          }
          key={_index + 5}
          className={classes.rowCell}
        >
          {renderTaskTimeLine(row.id)}
        </TableCell>
        <TableCell
          sx={{ width: 60 }}
          key={_index + 6}
          className={classes.rowCell}
        >
          {renderSeeMoreTaskBtn(row.id)}
        </TableCell>
      </React.Fragment>
    );
  }

  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table
        size="small"
        {...props}
        sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
      />
    ),
    // TableHead:({item:_item, ...props}) => <TableHead  {...props} className={classes.tableHeader} sx={{height:40}} />,
    TableHead,
    TableRow: ({ item: _item, ...props }) => (
      <TableRow
        key={_item.id}
        className={`row-data ${
          _item?.requestsTreated === false ? "notTreatedRequest" : ""
        }`}
        {...props}
      />
    ),
    TableBody: React.forwardRef((props, ref) => (
      <TableBody {...props} ref={ref} />
    ))
  };

  return (
    <div
      style={addForm ? { height: "calc(100% - 188px)" } : { height: "99.5%" }}
      className={classes.listContainer}
    >
      <div className={classes.header}>
        {!addForm && (
          <div className={classes.actionBtnContainer}>
            <div className="left">
              <LinkProject
                className={classes.search}
                color="secondary"
                label=" "
                size="small"
              />

              {/* <ProjectFilters /> */}
              {(isSuperUser || isManager) && (
                <>
                  <button className="add-project" onClick={handleForm}>
                    <ReactSVG src={faAdd} />
                  </button>
                </>
              )}
            </div>
            <ExportActions />
          </div>
        )}
        <ActiveFilters />
      </div>
      {/* // hereee */}

      <TableVirtuoso
        className={classes.table}
        data={projectList()}
        components={VirtuosoTableComponents}
        fixedHeaderContent={ProjectListHeader}
        itemContent={rowContent}
        size="small"
      />
    </div>
  );
};

export default ProjectList;
