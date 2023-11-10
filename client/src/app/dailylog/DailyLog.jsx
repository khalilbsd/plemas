import React, { useEffect, useState } from "react";
import { dailyLogStyle } from "./style";
import { Grid, Skeleton } from "@mui/material";
import TasksList from "../Components/dailylog/TasksList";
import { notify } from "../Components/notification/notification";
import { NOTIFY_ERROR } from "../../constants/constants";
import { useGetDailyLogTasksMutation } from "../../store/api/tasks.api";
import { useDispatch } from "react-redux";
import { setUserDailyTasks } from "../../store/reducers/task.reducer";
import JoinableTasks from "../Components/dailylog/JoinableTasks";
import useGetStateFromStore from "../../hooks/manage/getStateFromStore";
import dayjs from "dayjs";
const DailyLog = () => {
  const classes = dailyLogStyle();

  const dailyTasks = useGetStateFromStore("task", "userDailyTasks");
  const generalTasks = useGetStateFromStore("task", "userGeneralTasks");
  const [history, setHistory] = useState(dayjs(new Date()));
  const [openJoinableTasks, setOpenJoinableTasks] = useState(false);
  const [disableJoin, setDisableJoin] = useState(false);

  const [getDailyLogTasks, { isLoading: loadingTasks }] =
    useGetDailyLogTasksMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadDailyTasks() {
      try {
        const res = await getDailyLogTasks(
          history.format("DD/MM/YYYY")
        ).unwrap();

        dispatch(
          setUserDailyTasks({
            allTasks: res.allTasks,
            joinableTasks: res.joinableTasks
          })
        );
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data.message);
      }
    }
    loadDailyTasks();
  }, [history]);

  const handleOpenJoinableTasks = () => {
    setOpenJoinableTasks((pevState) => !pevState);
  };

  const handleDate = (date) => {
    console.log(
      date
        .startOf("day")
        .isSame(dayjs(new Date()).startOf("day").locale("en-gb"))
    );
    if(!(
      date
        .startOf("day")
        .isSame(dayjs(new Date()).startOf("day").locale("en-gb"))
    )) {
      setOpenJoinableTasks(false);
      setDisableJoin(true);
    } else {
      setDisableJoin(false);
    }
    setHistory(date);
  };

  return (
    <div className={classes.dailyLogPage}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid item xs={openJoinableTasks?1:122} sm={openJoinableTasks?1:122} mg={6} lg={openJoinableTasks?7:12} sx={{ height: "100%" }}>
          <div className={classes.usersTasks}>
            {!loadingTasks ? (
              <TasksList
                joinDisabled={disableJoin}
                historyDate={history}
                handleDateChange={handleDate}
                tasks={generalTasks || []}
                handleJoinable={handleOpenJoinableTasks}
                joinable={openJoinableTasks}
              />
            ) : (
              <Skeleton className={classes.generalTasks} />
            )}
          </div>
        </Grid>
        <Grid item xs={openJoinableTasks?12:0} sm={openJoinableTasks?12:0} mg={openJoinableTasks?6:0} lg={openJoinableTasks?5:0} sx={{ height: "100%" }}>
          <div
            className={`${classes.card} taskList ${
              openJoinableTasks ? "collapsed" : "hidden"
            } `}
          >
            <h2 className={classes.sectionTitle}>
              les tâches auxquelles vous pouvez participer{" "}
            </h2>

            {openJoinableTasks && <JoinableTasks open={openJoinableTasks} />}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default DailyLog;
