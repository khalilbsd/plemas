import dayjs from "dayjs";
import React from "react";
import { useDispatch } from "react-redux";
import { ReactSVG } from "react-svg";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import { useAssignHoursInTaskMutation } from "../../../store/api/tasks.api";
import { updateUserGeneralTasksHours } from "../../../store/reducers/task.reducer";
import { dailyLogStyle } from "../../dailylog/style";
import faAdd from "../../public/svgs/light/plus.svg";
import faClose from "../../public/svgs/light/xmark.svg";
import { notify } from "../notification/notification";
import { projectDetails } from "../projects/style";
import TaskItem from "./TaskItem";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
const TasksList = ({ handleJoinable, joinable, tasks,handleDateChange,historyDate,joinDisabled }) => {
  const classes = dailyLogStyle();
  const classesDetails = projectDetails();

  const [assignHoursInTask] = useAssignHoursInTaskMutation();
  const dispatch = useDispatch();

  const handleChangeSubmit = async (
    hours,
    projectID,
    taskID,
    interventionID,
    history
  ) => {
    console.log(hours, projectID, taskID);
    console.log("changing hours ");
    try {
      dispatch(
        updateUserGeneralTasksHours({ id: interventionID, hours: hours })
      );
      const res = await assignHoursInTask({
        body: {
          taskID,
          hours: parseInt(hours),
          date:historyDate
        },
        projectID
      }).unwrap();
      notify(NOTIFY_SUCCESS, res?.message);
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };


  return (
    <div className={`${classes.card} collapsed`}>
     {!joinDisabled&& <div className={`${classesDetails.actions} top`}>
        <button onClick={handleJoinable}>
          {!joinable ? <ReactSVG src={faAdd} /> : <ReactSVG src={faClose} />}
          <span className="text">{!joinable ? "Ajouter" : "Fermer"}</span>
        </button>
      </div>}
      <div className={classes.sectionHeader}>
        <h2 className={classes.sectionTitle}>vos tâches</h2>
        <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            className={classes.datePicker}
            label="Date"
            defaultValue={historyDate}
            minDate={dayjs().subtract(7,'day')}
            maxDate={dayjs()}
            size="small"
            onChange={(newValue)=>handleDateChange(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <div className={classes.warning}>
      Veuillez noter que les tâches colorées en rouge sont à effectuer aujourd'hui.
      </div>
      <div className={classes.taskList}>
        {tasks.map((daily, idx) => (
          <TaskItem
          joinDisabled={joinDisabled}
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

export default TasksList;
