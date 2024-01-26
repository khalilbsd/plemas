import React from "react";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import { projectsStyles } from "../style";
// import { projectTestList } from "./test/projectList.test";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { useDispatch } from "react-redux";
import { TableVirtuoso } from "react-virtuoso";
import {
  TASK_STATE_BLOCKED,
  TASK_STATE_DOING,
  TASK_STATE_TRANSLATION
} from "../../../../constants/constants";
import useIsUserCanAccess from "../../../../hooks/access";
import {
  changeDailyFilter,
  filterProjectsList,
  popTaskStateFromFilter
} from "../../../../store/reducers/manage.reducer";
import faAdd from "../../../public/svgs/solid/plus.svg";
import ExportActions from "./ExportActions";
import ProjectLine from "./ProjectLine";
import ProjectListHeader from "./ProjectListHeader";
import LinkProject from "./addProject/LinkProject";
import ActiveFilters from "./filter/ActiveFilters";
import useCheckActiveFilters from "../../../../hooks/activeFilters";
import useCheckProjectFiltersOnly from "../../../../hooks/onlyProjectFilters";

const ProjectList = ({ addForm, handleForm }) => {
  const classes = projectsStyles();
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const isFiltersActive = useCheckActiveFilters();
  const isFiltersOnlyProjectFilters = useCheckProjectFiltersOnly();
  // const [dailyFilter, setDailyFilter] = useState(true);
  const dailyFilter = useGetStateFromStore("manage", "projectListDailyFilter");
  // const projects = useGetStateFromStore("manage", "projectsList");
  const tasks = useGetStateFromStore("manage", "projectsTaskList");
  const tasksFiltered = useGetStateFromStore(
    "manage",
    "projectsTaskListFiltered"
  );
  const dispatch = useDispatch();
  const filterTaskState = useGetStateFromStore("manage", "projectsTaskFilters");
  const addProjectState = useGetStateFromStore("manage", "addProject");

  const disableDailyFilter = () => {
    dispatch(changeDailyFilter(false));
    dispatch(
      filterProjectsList({
        flag: true,
        value: TASK_STATE_DOING,
        attribute: "state",
        popFilter: true
      })
    );
    dispatch(
      filterProjectsList({
        flag: true,
        value: TASK_STATE_BLOCKED,
        attribute: "state",
        popFilter: true
      })
    );
    dispatch(popTaskStateFromFilter(TASK_STATE_DOING));
  };
  const projectList = () => {
    let listPastTodayDate = [];
    let listBeforeTodayDate = [];
    if (!dailyFilter) {
      let tl = addProjectState.projectsListFiltered.filter((project) =>
        !isFiltersActive
          ? true
          : isFiltersOnlyProjectFilters
          ? true
          : projectTasks(project.id).length
      );
      if (!isFiltersActive) {

        return tl.sort((a, b) => {
          return dayjs(b.createdAt) - dayjs(a.createdAt);
        });
      } else {


        tl.forEach((project) => {
          if (
            dayjs(projectTasks(project.id)[0]?.dueDate)
              .startOf("day")
              .locale("en-gb") >=
            dayjs(new Date()).startOf("day").locale("en-gb")
          ) {
            listPastTodayDate.push(project);
          } else {
            listBeforeTodayDate.push(project);
          }
        });
        return listPastTodayDate.concat(listBeforeTodayDate);
      }
    } else {
      let dailyList = addProjectState.projectsListFiltered
        .filter((project) => projectTasks(project.id).length)
        .sort((a, b) => {
          return (
            dayjs(projectTasks(a.id)[0].dueDate) -
            dayjs(projectTasks(b.id)[0].dueDate)
          );
        });
      dailyList.forEach((project) => {
          let pt = projectTasks(project.id)
        if (
          dayjs(pt[pt.length -1 ].dueDate)
            .startOf("day")
            .locale("en-gb") >= dayjs(new Date()).startOf("day").locale("en-gb")
        ) {
          listPastTodayDate.push(project);
        } else {
          listBeforeTodayDate.push(project);
        }
      });
      return listPastTodayDate.concat(listBeforeTodayDate);
    }
  };

  function projectTasks(projectID) {
    let projTasks = tasksFiltered.length ? tasksFiltered : tasks;
    const projectTasksList = projTasks?.filter(
      (item) => item.projectID === projectID
    );
    if (!projectTasksList) return [];

    return projectTasksList[0]?.tasks.filter((task) => {
      // if (dailyFilter) {
      //   return task.state === TASK_STATE_DOING_ORG;
      // }
      return filterTaskState.length
        ? filterTaskState.includes(
            TASK_STATE_TRANSLATION.filter((t) => t.label === task.state)[0]
              ?.value
          )
        : true;
    });
  }

  function rowContent(_index, row) {
    return (
      <ProjectLine
        addForm={addForm}
        row={row}
        index={_index}
        projectTasks={projectTasks}
      />
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
        <ActiveFilters
          dailyFilter={dailyFilter}
          disableDailyFilter={disableDailyFilter}
        />
      </div>
      {/* // hereee */}

      <TableVirtuoso
        className={classes.table}
        data={projectList()}
        components={VirtuosoTableComponents}
        fixedHeaderContent={() => (
          <ProjectListHeader disableDailyFilter={disableDailyFilter} />
        )}
        itemContent={rowContent}
        size="small"
      />
    </div>
  );
};

export default ProjectList;
