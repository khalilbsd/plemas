import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import { setLinkedProject } from "../../../../store/reducers/manage.reducer";
import { listStyle, projectsStyles } from "../style";
// import { projectTestList } from "./test/projectList.test";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, GridActionsCellItem, frFR } from "@mui/x-data-grid";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {
  TASK_STATE_BLOCKED,
  TASK_STATE_DOING,
  TASK_STATE_TRANSLATION
} from "../../../../constants/constants";
import useIsUserCanAccess from "../../../../hooks/access";
import { formattedDate } from "../../../../store/utils";
import faAdd from "../../../public/svgs/solid/plus.svg";
import CustomNoRowsOverlay from "../../NoRowOverlay/CustomNoRowsOverlay";
import CustomDataGridHeaderColumnMenu from "../../customDataGridHeader/CustomDataGridHeaderColumnMenu";
import CustomDataGridToolbar from "../../customDataGridToolbar/CustomDataGridToolbar";
import { CustomCancelIcon, CustomPlusIcon } from "../../icons";
import { projectTaskDetails } from "../../projects/style";
import LinkProject from "./addProject/LinkProject";
import { priorityColors } from "./addProject/PriorityField";
import ProjectFilters from "./filter/ProjectFilters";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";

const ProjectList = ({ addForm, handleForm, loadingProjectList }) => {
  const classes = projectsStyles();
  const tasksStyles = projectTaskDetails();

  const { isSuperUser, isManager } = useIsUserCanAccess();
  const projects = useGetStateFromStore("manage", "projectsList");
  const tasks = useGetStateFromStore("manage", "projectsTaskList");
  const twoWeeksDates = useGetStateFromStore("project", "twoWeeksList");
  const colors = useGetStateFromStore("userInfo", "avatarColors");
  const addProjectState = useGetStateFromStore("manage", "addProject");
  const [projectToCollapse, setProjectToCollapse] = useState(undefined);
  const navigate = useNavigate();
  const listClasses = listStyle();
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
    const projectTasksList = tasks?.filter(
      (item) => item.projectID === projectID
    );
    if (!projectTasksList) return [];

    return projectTasksList[0]?.tasks;
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
  const columns = [
    {
      headerName: "Nom du projet",
      field: "projectCustomId",
      width: 200
    },
    {
      headerName: "CP",
      field: "manager",

      width: 50
    },
    {
      headerName: "Lots",
      field: "lots",
      width: 60
    },
    {
      headerName: "Phase",
      field: "activePhase",

      width: 50
    },
    {
      headerName: " ",
      field: "tasks",
      width: 250
    },
    {
      headerName: "Status",
      field: "phaseStatus",
      width: 80
    }
  ];

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
      projectTasks(projectID)?.map((task, idx) => {
        return (
          <div key={idx} className={classes.taskStates}>
            <Tooltip key={idx} title={task?.name}>
              <span>
              {task?.name}
              </span>
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
      projectTasks(projectID)?.map((task, idx) => {
        return (
          <div key={idx} className={classes.taskStates}>
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
    const taskElements = projectTasks(projectID)?.map((task, idx) => {
      // Perform calculations here
      let { startDate, dueDate } = task;
      //converting dates
      let start = formattedDate(startDate, true);
      let due = formattedDate(dueDate, true);

      let startIdx = convertedDates.findIndex((date) => date === start);
      let dueIdx = convertedDates.findIndex((date) => date === due);

      let width = 0;
      let position = 0;
      if (startIdx === -1 && dueIdx === -1) {
        let startConverted = dayjs(start, "DD/MM/YYYY");
        let dueConverted = dayjs(due, "DD/MM/YYYY");

        if (
          startConverted < dayjs(new Date()) &&
          dueConverted > dayjs(new Date())
        ) {
          width = 15 * 40;
          position = 0;
        }
      } else {
        position = startIdx !== -1 ? startIdx * 40 : 0;
        let diff = startIdx > -1 ? startIdx : 0;
        width =
          dueIdx !== -1
            ? dueIdx
              ? (dueIdx - diff) * 40
              : 1 * 40
            : (convertedDates.length - startIdx) * 40;
      }

      return (
        <div
          data-date={task.dueDate}
          key={idx}
          style={{ width: width, transform: `translateX(${position}px)` }}
          className={classes.progressBarContainer}
        >
          <span className={classes.progressBar}>
            {dayjs(task.dueDate).locale("fr").format("dddd DD/MM/YYYY ")}
          </span>
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

  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer  {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table
        {...props}
        sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
      />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => (
      <TableRow key={_item.id} className="row-data" onClick={() =>
        addProjectState.isFiltering && addForm
        ? handleClickProject(_item.id)
        : handleNavigation(_item.id)
        } {...props} />
    ),
    TableBody: React.forwardRef((props, ref) => (
      <TableBody {...props} ref={ref} />
    ))
  };

  function rowContent(_index, row) {
    return (
      <React.Fragment>
        <TableCell key={_index} className={classes.rowCell} component="th" scope="row">
        <Tooltip  key={_index} title={row?.projectCustomId}>
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
        <TableCell key={_index+1} className={classes.rowCell}>
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
        </TableCell>
        <TableCell key={_index+2} className={classes.rowCell}>
          <div className={classes.lots}>
            {row.lots.map((content,idx) => (
              <p key={idx} className={classes.lot} label={content}>
                {content}
              </p>
            ))}
          </div>
        </TableCell>
        <TableCell  key={_index+3}className={classes.rowCell}>{row?.activePhase}</TableCell>
        <TableCell className={classes.rowCell}>
          {renderProjectTasks(row.id)}
        </TableCell>
        <TableCell  key={_index+4}className={classes.rowCell}>
          {renderTasksStates(row.id)}
        </TableCell>
        <TableCell  key={_index+5}className={classes.rowCell}>
          {renderTaskTimeLine(row.id)}
        </TableCell>
        <TableCell sx={{width:60}}  key={_index+6}className={classes.rowCell}>
          {renderSeeMoreTaskBtn(row.id)}
        </TableCell>
      </React.Fragment>
    );
  }
  function fixedHeaderContent() {
    return (
      <TableRow className={classes.tableHead}>
        {columns.map((column, idx) => (
          <TableCell
            className={classes.tableHeader}
            key={idx}
            variant="head"
            // align={column.numeric || false ? 'right' : 'left'}
            style={{ width: column.width }}
          >
            {column.headerName}
          </TableCell>
        ))}
        <TableCell
          className={classes.tableHeader}
          sx={{ width: (twoWeeksDates.length -1) * 40 }}
        >
          <div className={classes.datesData}>
            {twoWeeksDates?.map(({ date, weekend }, index) => (
              <div
                key={index}
                className={classes.dateColumn}
                // style={{ minWidth: 14, maxWidth: 14 }}
              >
                <p
                  data-header-date={date}
                  className={`${classes.dateTitle} ${
                    weekend ? "disabled" : ""
                  }`}
                  key={index}
                >
                  {date[0].toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </TableCell>
        <TableCell
          className={classes.tableHeader}
          sx={{ width: 60 }}
        ></TableCell>
      </TableRow>
    );
  }

  return (
    <div
      style={addForm ? { height: "calc(100% - 188px)" } : { height: "99.5%" }}
      className={classes.listContainer}
    >
      <div className={classes.header}>
        {!addForm && (
          <div className={classes.addBtnContainer}>
            <LinkProject
              className={classes.search}
              color="secondary"
              label=" "
              size="small"
            />

            {(isSuperUser || isManager) && (
              <>
                <ProjectFilters />
                <button className="add-project" onClick={handleForm}>
                  <ReactSVG src={faAdd} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {/* // hereee */}

      <TableVirtuoso
        className={classes.table}
        data={projectList()}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </div>
  );
};

export default ProjectList;
