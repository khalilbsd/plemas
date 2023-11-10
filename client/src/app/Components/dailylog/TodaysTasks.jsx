import React from "react";
import { dailyLogStyle } from "../../dailylog/style";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import TaskItem from "./TaskItem";
import { useAssignHoursInTaskMutation } from "../../../store/api/tasks.api";
import { notify } from "../notification/notification";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import { useDispatch } from "react-redux";
import { updateUserDailyTasksHours } from "../../../store/reducers/task.reducer";

const TodaysTasks = () => {
  const classes = dailyLogStyle();
  const dailyTasks = useGetStateFromStore("task", "userDailyTasks");
  const joinableTasks = useGetStateFromStore("task", "userPotentialTasks");
  const [assignHoursInTask, { isLoading: loadingHoursPerTask }] =
    useAssignHoursInTaskMutation();
  const dispatch = useDispatch();

  const handleChangeSubmit = async (hours, projectID, taskID,interventionID) => {
    console.log(hours,projectID,taskID);
    try {
      dispatch(updateUserDailyTasksHours({ id: interventionID, hours: hours }));
      const res = await assignHoursInTask({
        body:{
          taskID,
          hours:parseInt(hours)
        },
        projectID
      }).unwrap();
      notify(NOTIFY_SUCCESS,res?.message)
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

// const handleChange=()


  return (
    <div className={classes.card}>
      <h2 className={classes.sectionTitle}>les tâches du jour</h2>
      <div className={classes.todays}>
        {dailyTasks.map((daily, idx) => (
          <TaskItem
          id={daily.id}
            key={idx}
            hours={daily.nbHours}
            task={daily?.task}
            project={daily?.project}
            handleChangeSubmit={handleChangeSubmit}

          />
        ))}
      </div>
    </div>
  );
};

export default TodaysTasks;
