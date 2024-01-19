import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import { projectsStyles } from "../style";
// import { projectTestList } from "./test/projectList.test";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "dayjs/locale/fr";
import { TableVirtuoso } from "react-virtuoso";
import {
  TASK_STATE_BLOCKED,
  TASK_STATE_DOING,
  TASK_STATE_DOING_ORG,
  TASK_STATE_TRANSLATION
} from "../../../../constants/constants";
import useIsUserCanAccess from "../../../../hooks/access";
import faAdd from "../../../public/svgs/solid/plus.svg";
import ExportActions from "./ExportActions";
import ProjectLine from "./ProjectLine";
import ProjectListHeader from "./ProjectListHeader";
import LinkProject from "./addProject/LinkProject";
import ActiveFilters from "./filter/ActiveFilters";
import { useDispatch } from "react-redux";
import { changeDailyFilter } from "../../../../store/reducers/manage.reducer";
import dayjs from "dayjs";

const ProjectList = ({ addForm, handleForm }) => {
  const classes = projectsStyles();
  const { isSuperUser, isManager } = useIsUserCanAccess();
  // const [dailyFilter, setDailyFilter] = useState(true);
  const dailyFilter = useGetStateFromStore("manage", "projectListDailyFilter");
  const projects = useGetStateFromStore("manage", "projectsList");
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
  };

  const projectList = () => {
    return !dailyFilter
      ? addProjectState.projectsListFiltered.filter(  (project) => projectTasks(project.id).length)
      : addProjectState.projectsListFiltered.filter(
          (project) => projectTasks(project.id).length
        ).sort((a,b)=>{
          // console.log(dayjs(projectTasks(a.id)[0].dueDate) - dayjs(projectTasks(b.id)[0].dueDate));
          return dayjs(projectTasks(a.id)[0].dueDate) - dayjs(projectTasks(b.id)[0].dueDate)
        })
        ;
    // if (addForm || addProjectState.isFiltering) {
    //   return addProjectState.projectsListFiltered;
    // }

    // return dailyFilter
    //   ? projects.filter((project) =>
    //       [TASK_STATE_DOING, TASK_STATE_BLOCKED].includes(project.state)
    //     )
    //   : projects;
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
