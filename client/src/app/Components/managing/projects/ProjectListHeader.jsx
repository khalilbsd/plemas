import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  NOTIFY_ERROR,
  TASK_STATE_TRANSLATION,
  progress_bar_width_cell
} from "../../../../constants/constants";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import {
  filterByTaskStatus,
  filterProjectsList,
  setProjectTaskListFiltered,
  setProjectTasksDateFilter
} from "../../../../store/reducers/manage.reducer";
import { projectsStyles } from "../style";
import ProjectHeadColumnFilter from "./filter/ProjectHeadColumnFilter";
import { ReactSVG } from "react-svg";
import faFilter from "../../../public/svgs/light/filter.svg";
import PopUp from "../../PopUp/PopUp";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import faArrowRight from "../../../public/svgs/light/arrow-right.svg";
import { useFilterProjectsTasksByDatesMutation } from "../../../../store/api/tasks.api";
import { notify } from "../../notification/notification";
import { setTwoWeeksDatesListFiltered } from "../../../../store/reducers/project.reducer";
const init = {
  manager: "",
  state: "",
  phase: "",
  lot: "",
  taskState: ""
};

const dateFilterInit = {
  open: false,
  startDate: dayjs(new Date()).locale("en-gb"),
  endDate: dayjs().locale("en-gb").add(21, "day")
};

const ProjectListHeader = () => {
  const [selected, setSelected] = useState(init);
  const classes = projectsStyles();
  const twoWeeksDates = useGetStateFromStore("project", "twoWeeksList");
  const WeeksDatesListFiltered = useGetStateFromStore(
    "project",
    "twoWeeksListFiltered"
  );
  const sideBarCollapsed = useGetStateFromStore("sidebar", "collapsed");
  const projects = useGetStateFromStore("manage", "projectsList");
  const dispatch = useDispatch();
  const [dateFilter, setDateFilter] = useState(dateFilterInit);
  const [filterProjectsTasksByDates, { isLoading: filtringByDates }] =
    useFilterProjectsTasksByDatesMutation();
  // const [filters, setFilters] = useState(filtersInit);

  const selectStates = () => {
    const list = [];
    projects.forEach((project) => {
      let exist = list.filter((item) => item === project.state);
      if (!exist.length) {
        list.push(project.state);
      }
    });
    return list;
  };
  const selectManagers = () => {
    const list = [];
    projects.forEach((project) => {
      let exist = list.filter(
        (item) => item.fullName === project.manager.fullName
      );
      if (!exist.length) {
        list.push(project.manager);
      }
    });
    return list;
  };

  const selectLots = () => {
    function getDifferentLots(list1, list2) {
      return list2.filter((element) => !list1.includes(element));
    }
    var list = [];
    projects.forEach((project) => {
      if (!project.lots.every((lot) => list.includes(lot))) {
        const lotsToAdd = getDifferentLots(list, project.lots);
        list = list.concat(lotsToAdd);
      }
    });
    return list;
  };

  const selectPhases = () => {
    const list = [];
    projects.forEach((project) => {
      let exist = list.filter((item) => item === project.activePhase);
      if (!exist.length) {
        list.push(project.activePhase);
      }
    });
    return list;
  };

  const handleChangeManager = (value) => {
    setSelected({ ...selected, manager: value });

    dispatch(
      filterProjectsList({
        flag: true,
        value: value?.fullName,
        attribute: "manager.fullName"
      })
    );
  };

  const handChangeState = (value) => {
    setSelected({ ...selected, state: value });

    dispatch(
      filterProjectsList({
        flag: true,

        value: value,
        attribute: "state"
      })
    );
  };
  const handleChangePhase = (value) => {
    setSelected({ ...selected, phase: value });
    dispatch(
      filterProjectsList({
        flag: true,
        value: value,
        attribute: "activePhase"
      })
    );
  };

  const handleChangeLots = (value) => {
    setSelected({ ...selected, lot: value });
    dispatch(
      filterProjectsList({
        flag: true,
        value: value,
        attribute: "lots"
      })
    );
  };

  const applyDateFilter = async () => {
    const projectIds = projects.map((project) => project.id);

    try {
      const res = await filterProjectsTasksByDates({
        projects: projectIds,
        start: dateFilter.startDate.format("DD/MM/YYYY"),
        end: dateFilter.endDate.format("DD/MM/YYYY"),
        nbWeeks: dateFilter.endDate.diff(dateFilter.startDate, "week")
      }).unwrap();

      dispatch(setTwoWeeksDatesListFiltered(res.dates));
      dispatch(setProjectTaskListFiltered(res.tasks));
      dispatch(
        setProjectTasksDateFilter({
          start: dateFilter.startDate.format("DD/MM/YYYY"),
        end: dateFilter.endDate.format("DD/MM/YYYY"),
        })
      );
      hideDatesFilter();
    } catch (error) {

      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const handleChangeTaskState = (value) => {
    setSelected({ ...selected, taskState: value });
    dispatch(filterByTaskStatus(value));
  };

  const showDatesFilter = () => {
    setDateFilter({ ...dateFilter, open: true });
  };
  const hideDatesFilter = () => {
    setDateFilter({ ...dateFilter, open: false });
  };

  const handleFilterStartDateChange = (startDate) => {
    if (dateFilter.endDate.diff(startDate, "day") > 21) {
      setDateFilter({
        ...dateFilter,
        startDate: startDate,
        endDate: startDate.add(21, "day")
      });
    }
  };
  const handleFilterEndDateChange = (endDate) => {
    if (endDate.isBefore(dateFilter.startDate)) {
      notify(
        NOTIFY_ERROR,
        "la date de fin du filtre ne peut être antérieure à la date de début."
      );
      setDateFilter({
        ...dateFilter,
        endDate: dateFilter.startDate.add(21, "day")
      });
      return;
    }
    setDateFilter({ ...dateFilter, endDate: endDate });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const managers = useMemo(() => selectManagers(), [projects]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const states = useMemo(() => selectStates(), [projects]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lots = useMemo(() => selectLots(), [projects]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const phase = useMemo(() => selectPhases(), [projects]);

  const columns = [
    {
      headerName: "Nom du projet",
      field: "projectCustomId",
      width: 200,
      filter: true,
      type: "state",
      ref: selected.state,
      items: states,
      title: "Filtre par état du projet",
      handler: handChangeState,
      filterWidth: 200
    },
    {
      headerName: "CP",
      field: "manager",
      title: "Filtre par chef de projet",
      filter: true,
      width: 41,
      type: "manager.fullName",
      handler: handleChangeManager,
      items: managers,
      ref: selected.manager,
      filterWidth: 300
    },
    {
      headerName: "Lots",
      field: "lots",
      filter: true,
      type: "lots",
      ref: selected.lot,
      title: "Filtre par lot",

      items: lots,
      handler: handleChangeLots,
      width: 51
    },
    {
      headerName: "Phase",
      field: "activePhase",
      title: "Filtre par phase",

      filter: true,
      width: 65,
      type: "phase",
      ref: selected.phase,
      items: phase,
      handler: handleChangePhase
    },
    {
      headerName: " ",
      field: "tasks",
      width: sideBarCollapsed ? 200 : 100,
      filter: false
    },
    {
      headerName: "Status",
      field: "phaseStatus",
      filter: true,
      width: 65,
      type: "taskState",
      items: TASK_STATE_TRANSLATION.map((state) => state.value),
      handler: handleChangeTaskState
    }
  ];

  const getDates = () => {
    if (WeeksDatesListFiltered.length) return WeeksDatesListFiltered;
    return twoWeeksDates;
  };

  return (
    <TableRow className={classes.tableHead}>
      {columns.map((column) => (
        <ProjectHeadColumnFilter
          key={column.headerName}
          column={{ ...column }}
        />
      ))}
      <TableCell
        className={classes.tableHeader}
        sx={{ width: twoWeeksDates.length * progress_bar_width_cell }}
      >
        <div className={classes.datesListHeader}>
          <div className={classes.datesData}>
            {getDates()?.map(({ date, weekend }, index) => (
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
          <div>
            <button onClick={showDatesFilter}>
              <ReactSVG className={classes.filterBtn} src={faFilter} />
            </button>
            <PopUp
              open={dateFilter.open}
              handleClose={hideDatesFilter}
              btnText="Appliqué filtre"
              icon={faFilter}
              handleSubmit={applyDateFilter}
            >
              <div className={classes.filterDate}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en-gb"
                >
                  <DatePicker
                    // className={classes.datePicker}
                    label="Date debut filtre"
                    defaultValue={dateFilter.startDate}
                    // minDate={dayjs().subtract(7, "day")}
                    maxDate={dateFilter.endDate}
                    slotProps={{
                      textField: { variant: "standard", size: "small" }
                    }}
                    onChange={(newValue) =>
                      handleFilterStartDateChange(newValue)
                    }
                  />
                </LocalizationProvider>
                <ReactSVG src={faArrowRight} className={classes.arrowIcon} />
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en-gb"
                >
                  <DatePicker
                    label="Date fin filtre"
                    value={dateFilter.endDate}
                    maxDate={dateFilter.endDate}
                    slotProps={{
                      textField: { variant: "standard", size: "small" }
                    }}
                    onChange={(newValue) => handleFilterEndDateChange(newValue)}
                  />
                </LocalizationProvider>
              </div>
            </PopUp>
          </div>
        </div>
      </TableCell>
      <TableCell className={classes.tableHeader} sx={{ width: 60 }}></TableCell>
    </TableRow>
  );
};

export default ProjectListHeader;
