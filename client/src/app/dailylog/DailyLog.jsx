import React, { useEffect } from "react";
import { dailyLogStyle } from "./style";
import { Grid, Skeleton } from "@mui/material";
import TodaysTasks from "../Components/dailylog/TodaysTasks";
import { notify } from "../Components/notification/notification";
import { NOTIFY_ERROR } from "../../constants/constants";
import { useGetDailyLogTasksMutation } from "../../store/api/tasks.api";
import { useDispatch } from "react-redux";
import { setUserDailyTasks } from "../../store/reducers/task.reducer";
const DailyLog = () => {
  const classes = dailyLogStyle();

  const [getDailyLogTasks, { isLoading: loadingTasks }] =
    useGetDailyLogTasksMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadDailyTasks() {
      try {
        const res = await getDailyLogTasks().unwrap();

        dispatch(
          setUserDailyTasks({
            allTasks: res.allTasks,
            todaysTasks: res.todaysTasks,
            joinableTasks: res.joinableTasks
          })
        );
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data.message);
      }
    }
    loadDailyTasks();
  }, []);

const handleDailyHoursChange=async(e)=>{
  // try {

  // } catch (error) {

  // }
}


  return (
    <div className={classes.dailyLogPage}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} mg={6} lg={8}>
          {!loadingTasks ? (
            <TodaysTasks />
          ) : (
            <Skeleton className={classes.dailySkeleton} />
          )}
        </Grid>
        <Grid item xs={12} sm={12} mg={6} lg={4}></Grid>
      </Grid>
    </div>
  );
};

export default DailyLog;
