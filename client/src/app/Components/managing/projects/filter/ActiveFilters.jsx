import React from "react";
import useGetStateFromStore from "../../../../../hooks/manage/getStateFromStore";
import Skeleton from "@mui/material/Skeleton";
import { filterStyles } from "./style";
import { ReactSVG } from "react-svg";
import faClose from "../../../../public/svgs/light/xmark.svg";
import { FILTER_TITLES } from "../../../../../constants/constants";
import {useDispatch} from 'react-redux'
import { clearProjectTasksDateFilter, popTaskStateFromFilter, setProjectTaskListFiltered, undoFilterType } from "../../../../../store/reducers/manage.reducer";
import { setTwoWeeksDatesListFiltered } from "../../../../../store/reducers/project.reducer";
const ActiveFilters = () => {
  const { filterType: active } = useGetStateFromStore("manage", "addProject");
  const taskFilters = useGetStateFromStore("manage", "projectsTaskFilters");
  const taskFilteredByDates = useGetStateFromStore("manage", "projectsTaskListFiltered");
  const taskDatesFilter = useGetStateFromStore("manage", "projectsTaskFiltersDates");
  const dispatch = useDispatch()

  const removeFilter = (type)=>{
    dispatch(undoFilterType(type))
  }
  const removeTaskFilter = (type)=>{
    dispatch(popTaskStateFromFilter(type))
  }

const removeTaskDateFilter =()=>{
  dispatch(setProjectTaskListFiltered([]))
  dispatch(clearProjectTasksDateFilter())
  dispatch(setTwoWeeksDatesListFiltered([]))
}

  const classes = filterStyles();
  if (!active)
    return (
      <Skeleton
        variant="rectangular"
        className={classes.activeFilterSkeleton}
      />
    );

  return (
    <div className={classes.activeFilterList}>
      <ul>
        {active.map((filter, key) => (
          <li key={key}>
            <div className={classes.activeFilter}>
              <div className="filter-value">
                <span>{FILTER_TITLES[filter.type]}</span>
                {filter.value}
                </div>
              <button onClick={()=>removeFilter(filter.type)}>
                <ReactSVG src={faClose} className="remove-filter" />
              </button>
            </div>
          </li>
        ))}
        {taskFilters.map((filter, key) => (
          <li key={key}>
            <div className={classes.activeFilter}>
              <div className="filter-value">
                <span>les taches qui sont </span>
                {filter}
                </div>
              <button onClick={()=>removeTaskFilter(filter)}>
                <ReactSVG src={faClose} className="remove-filter" />
              </button>
            </div>
          </li>
        ))}
        {
          taskFilteredByDates &&(

            taskFilteredByDates.length > 0&&
            <li>
           <div className={classes.activeFilter}>
              <div className="filter-value">
                <span>les taches qui sont entre </span>
                {taskDatesFilter.start} et {taskDatesFilter.end}
                </div>
              <button onClick={()=>removeTaskDateFilter()}>
                <ReactSVG src={faClose} className="remove-filter" />
              </button>
            </div>
        </li>
          )
        }
      </ul>
    </div>
  );
};

export default ActiveFilters;
