import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React from "react";
import { useDispatch } from "react-redux";
import { ReactSVG } from "react-svg";
import {
  DAILY_HOURS_VALUE,
  NOTIFY_ERROR,
  NOTIFY_SUCCESS
} from "../../../constants/constants";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { useAssignManagerHoursBulkMutation } from "../../../store/api/projects.api";
import { useAssignHoursInTaskMutation } from "../../../store/api/tasks.api";
import {
  hideDailyProject,
  hideDailyTask,
  updateDailyHours
} from "../../../store/reducers/task.reducer";
import { dailyLogStyle } from "../../dailylog/style";
import faSave from "../../public/svgs/light/floppy-disk.svg";
import faAdd from "../../public/svgs/light/plus.svg";
import faClose from "../../public/svgs/light/xmark.svg";
import { notify } from "../notification/notification";
import { projectDetails } from "../projects/style";
import TaskItem from "./TaskItem";
const TasksList = ({
  handleJoinable,
  joinable,
  tasks,
  handleDateChange,
  historyDate,
  joinDisabled
}) => {
  const classes = dailyLogStyle();
  const classesDetails = projectDetails();
  const hourDivision = useGetStateFromStore("task", "dailyLogDevisions");
  const managedProjects = useGetStateFromStore("task", "dailyProjectManager");

  const [assignHoursInTask] = useAssignHoursInTaskMutation();
  const [assignManagerHoursBulk] = useAssignManagerHoursBulkMutation();
  const dispatch = useDispatch();

  const handleChangeHourTask = (id, val) => {
    dispatch(
      updateDailyHours({ id: id, percent: parseInt(val), type: "tasks" })
    );
  };
  const handleChangeHourProject = (id, val) => {
    dispatch(
      updateDailyHours({ id: id, percent: parseInt(val), type: "projects" })
    );
  };

  const handleSaveHours = async () => {
    try {
      await assignHoursInTask({
        date: historyDate,
        userTasks: hourDivision?.tasks
      }).unwrap();

      await assignManagerHoursBulk({
        date: historyDate,
        projectsHours: hourDivision?.projects
      }).unwrap();

      notify(NOTIFY_SUCCESS, "mise a jour des heurs a terminé");
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const hideTask = (id) => {
    dispatch(hideDailyTask({ id }));
  };
  const hideProject = (id) => {
    dispatch(hideDailyProject({ id }));
  };

  return (
    <div className={`${classes.card} collapsed`}>
      <div className={`${classesDetails.actions} top`}>
        <button onClick={handleSaveHours}>
          <ReactSVG src={faSave} />
          <span className="text">Sauvegarder</span>
        </button>
        {!joinDisabled && (
          <button onClick={handleJoinable}>
            {!joinable ? <ReactSVG src={faAdd} /> : <ReactSVG src={faClose} />}
            <span className="text">{!joinable ? "Ajouter" : "Fermer"}</span>
          </button>
        )}
      </div>
      <div className={classes.sectionHeader}>
        <h2 className={classes.pageTitle}>DailyLog</h2>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            // className={classes.datePicker}
            label="Date"
            defaultValue={historyDate}
            minDate={dayjs().subtract(7, "day")}
            maxDate={dayjs()}
            slotProps={{ textField: { variant: "standard", size: "small" } }}
            onChange={(newValue) => handleDateChange(newValue)}
          />
        </LocalizationProvider>
      </div>
      {/* <div className={classes.warning}>
        Veuillez noter que les tâches colorées en rouge sont à effectuer
        aujourd'hui.
      </div> */}
      <div className={classes.scrollView}>
        {
          <div className={classes.taskList}>
            <h2 className={classes.sectionTitle}>vos projet</h2>
            {managedProjects.map((project, idx) => (
              <TaskItem
                joinDisabled={joinDisabled}
                id={project.id}
                handleChange={handleChangeHourProject}
                key={idx}
                project={project}
                isProject={true}
                handleHide={(e) => hideProject(project.id)}
                percentValue={DAILY_HOURS_VALUE}
                value={hourDivision.projects[project.id]?.value}
              />
            ))}
          </div>
        }
        <div className={classes.taskList}>
          <h2 className={classes.sectionTitle}>vos tâches</h2>
          {tasks.map((daily, idx) => (
            <TaskItem
              handleChange={handleChangeHourTask}
              joinDisabled={joinDisabled}
              id={daily.id}
              key={idx}
              hours={daily.nbHours}
              task={daily?.task}
              project={daily?.project}
              percentValue={DAILY_HOURS_VALUE}
              value={hourDivision.tasks[daily.id]?.value}
              handleHide={(e) => hideTask(daily.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksList;
