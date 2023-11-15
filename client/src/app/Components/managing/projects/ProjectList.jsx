import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import { setLinkedProject } from "../../../../store/reducers/manage.reducer";
import { listStyle, projectsStyles } from "../style";
// import { projectTestList } from "./test/projectList.test";
import { Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { TASK_STATE_TRANSLATION } from "../../../../constants/constants";
import useIsUserCanAccess from "../../../../hooks/access";
import { formattedDate } from "../../../../store/utils";
import faAdd from "../../../public/svgs/solid/plus.svg";
import CustomDataGridHeaderColumnMenu from "../../customDataGridHeader/CustomDataGridHeaderColumnMenu";
import { projectTaskDetails } from "../../projects/style";
import LinkProject from "./addProject/LinkProject";
import { priorityColors } from "./addProject/PriorityField";

const ProjectList = ({ addForm, handleForm }) => {
  const classes = projectsStyles();
  const tasksStyles = projectTaskDetails();

  const { isSuperUser, isManager } = useIsUserCanAccess();
  const projects = useGetStateFromStore("manage", "projectsList");
  const tasks = useGetStateFromStore("manage", "projectsTaskList");
  const twoWeeksDates = useGetStateFromStore("project", "twoWeeksList");
  const colors = useGetStateFromStore("userInfo", "avatarColors");
  const addProjectState = useGetStateFromStore("manage", "addProject");
  const navigate = useNavigate();
  const listClasses = listStyle();
  // const [emptyMessage, setEmptyMessage] = useState("");

  const dispatch = useDispatch();
  const getPriorityColor = (id) => {
    const priority = priorityColors.filter((color) => color.value === id)[0];
    if (!priority) return { code: "var(--bright-orange)", value: -1 };

    return { code: priority.code, value: priority.value };
  };

  const projectManagerNamesOption = () => {
    let names = [];
    projectList().forEach((item) => {
      if (!names.includes(item?.manager?.fullName)) {
        names.push(item?.manager?.fullName);
      }

    });
    return names;
  };
  const phaseOptionValues = () => {
    let phases = [];
    projectList().forEach((item) => {
      if (!phases.includes(item?.activePhase)) {
        phases.push(item?.activePhase);
      }

    });
    return phases;
  };

  function projectTasks(projectID) {
    const projectTasksList = tasks?.filter(
      (item) => item.projectID === projectID
    );
    if (!projectTasksList) return [];

    return projectTasksList[0]?.tasks;
  }

  function convertTwoWeeksDates() {
    return twoWeeksDates?.map(({ date }) => {
      return date.split(" ")[1];
    });
  }

  const getColumns = () => {
    const columns = [
      {
        headerName: "Nom du projet",
        field: "projectCustomId",
        width: 200,
        renderCell: (params) => {
          return (
            <p className={classes.projectName}>
              <span
                className="priority"
                style={{
                  backgroundColor: getPriorityColor(params.row.priority).code
                }}
              ></span>
              {params.row?.projectCustomId}
            </p>
          );
        }
      },
      {
        headerName: "Chef de projet",
        field: "manager",
        filterable: true,
        width: 200,
        type: "singleSelect",
        valueOptions: projectManagerNamesOption(),
        valueGetter: (params) => params.row?.manager?.fullName,
        // filterValueGetter: (params) => params.row?.manager?.fullName,
        renderCell: (params) => {
          if (params.row.manager.image) {
            return (
              <div className={classes.managerContainer}>
                <img
                  className={classes.avatar}
                  src={`${process.env.REACT_APP_SERVER_URL}${params.row.manager.image}`}
                  alt={`manager ${params.row.manager.fullName} avatar`}
                />
                <p className={classes.managerFullName}>
                  {params.row.manager.fullName}
                </p>
              </div>
            );
          }
          return (
            <div className={classes.managerContainer}>
              <span
                className={`${classes.avatar} ${
                  colors[params.row.id % colors?.length]
                }`}
              >
                {params.row.manager?.fullName[0]?.toUpperCase()}
                {params.row.manager?.fullName.split(" ")[1][0].toUpperCase()}
              </span>
              <p className={classes.managerFullName}>
                {params.row.manager.fullName}
              </p>
            </div>
          );
        }
      },
      {
        headerName: "Lots",
        field: "lots",
        width: 110,
        renderCell: (params) => {
          return params.row.lots.map((content) => (
            <Chip key={content} label={content} />
          ));
        }
      },
      {
        headerName: "Phase",
        field: "activePhase",
        type: "singleSelect",
        filterable: true,
        valueOptions: phaseOptionValues(),
        valueGetter: (params) => params.row?.activePhase,
        width: 80
      },
      {
        headerName: "Taches",
        field: "tasks",
        filterable: false,
        width: 200,
        columnMenu: false,
        sortable: false,
        menu: false,
        renderCell: (params) => {
          return projectTasks(params.row.id)?.length ? (
            <div className={classes.task}>
              {projectTasks(params.row.id)?.length &&
                projectTasks(params.row.id)?.map((task, idx) => (
                  <div key={idx} className={classes.taskStates}>
                    {task?.name}
                  </div>
                ))}
            </div>
          ) : (
            <p className={classes.emptyTasks}>
              il n'y a pas de tâches planifiées
            </p>
          );
        }
      },

      {
        headerName: "Status",
        field: "phaseStatus",
        width: 120,
        filterable: false,
        columnMenu: false,
        sortable: false,
        menu: false,
        renderCell: (params) => {
          return (
            <div>
              {projectTasks(params.row.id)?.length ? (
                projectTasks(params.row.id)?.map((task, idx) => (
                  <div key={idx} className={classes.taskStates}>
                    <span className={`${tasksStyles.task} ${task.state}`}>
                      {
                        TASK_STATE_TRANSLATION.filter(
                          (state) => state.label === task.state
                        )[0]?.value
                      }
                    </span>
                  </div>
                ))
              ) : (
                <span></span>
              )}
            </div>
          );
        }
      },
      {
        headerName: "dates",
        field: "dates",
        width: 750,
        filterable: false,
        columnMenu: false,
        sortable: false,
        menu: false,
        renderHeader: () => {
          return (
            <div className={classes.datesData}>
              {twoWeeksDates?.map(({ date, weekend }, index) => (
                <div
                  key={index}
                  className={classes.dateColumn}
                  // style={{ minWidth: 14, maxWidth: 14 }}
                >
                  <p
                    className={`${classes.dateTitle} ${
                      weekend ? "disabled" : ""
                    }`}
                    key={index}
                  >
                    {date}
                  </p>
                </div>
              ))}
            </div>
          );
        },

        renderCell: (params) => {
          const convertedDates = convertTwoWeeksDates();

          // console.log(convertedDates);
          const taskElements = projectTasks(params.row.id)?.map((task, idx) => {
            // Perform calculations here
            let { startDate, dueDate } = task;
            //converting dates
            let start = formattedDate(startDate, true);
            let due = formattedDate(dueDate, true);

            let startIdx = convertedDates.findIndex((date) => date === start);
            let dueIdx = convertedDates.findIndex((date) => date === due);
            // console.log("start date ",start," postion ", startIdx," end date ",due," position",dueIdx);
            let width = 0;
            let position = 0;
            if (startIdx === -1 && dueIdx === -1) {
              let startConverted = dayjs(start, "DD/MM/YYYY");
              let dueConverted = dayjs(due, "DD/MM/YYYY");

              if (
                startConverted < dayjs(new Date()) &&
                dueConverted > dayjs(new Date())
              ) {
                width = 15 * 50;
                position = 0;
              }
            } else {
              position = startIdx !== -1 ? startIdx * 50 : 0;
              width =
                dueIdx !== -1
                  ? dueIdx
                    ? dueIdx * 50
                    : 1 * 50
                  : (convertedDates.length - startIdx) * 50;
            }

            return (
              <div
                key={idx}
                style={{ width: width, transform: `translateX(${position}px)` }}
                className={classes.progressBarContainer}
              >
                <span className={classes.progressBar}> </span>
              </div>
            );
          });

          return <div>{taskElements}</div>;
        }
      }
    ];
    return columns;
  };

  const handleNavigation = (rowID) => {
    navigate(`/projects/${rowID}`);
  };

  const projectList = () => {
    if (addForm || addProjectState.isFiltering) {
      return addProjectState.projectsListFiltered;
    }
    return projects;
  };
  // useEffect(() => {
  //   if (!projects?.length) {
  //     setEmptyMessage(
  //       "Vous n'intervenez dans aucun projet pour l'instant ! Veuillez patienter."
  //     );
  //     return;
  //   }
  //   setEmptyMessage("");
  // }, [projects]);

  const handleClickProject = (rowID) => {
    dispatch(setLinkedProject(rowID));
    const elements = document.querySelectorAll(".row-data");
    elements.forEach((element) => {
      element.classList.remove("active");
    });
  };

  const getRowClassName = (params) => {
    return params.row.requestsTreated === false ? "notTreatedRequest" : "";
  };

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
              <button onClick={handleForm}>
                <ReactSVG src={faAdd} />
              </button>
            )}
          </div>
        )}
      </div>
      <DataGrid
        loading={!projectList()?.length}
        className={`${listClasses.list} integrated`}
        rows={projectList()}
        columns={getColumns()}
        getRowClassName={getRowClassName}
        onRowSelectionModelChange={
          addProjectState.isFiltering && addForm
            ? handleClickProject
            : handleNavigation
        }
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 9
            }
          }
        }}
        slots={{ columnMenu: CustomDataGridHeaderColumnMenu }}
        pageSizeOptions={[9]}
        // disableRowSelectionOnClick
      />
    </div>
  );
};

export default ProjectList;
