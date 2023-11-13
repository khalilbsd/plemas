import React from "react";
import { dailyLogStyle } from "../../dailylog/style";

import Slider from "@mui/material/Slider";
import { TASK_STATE_TRANSLATION } from "../../../constants/constants";
import { CustomJoinIcon } from "../icons";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { updateUserGeneralTasksHours } from "../../../store/reducers/task.reducer";

const TaskItem = ({
  hours,
  task,
  project,
  handleChangeSubmit,
  id,
  joinTask,
  joinDisabled
}) => {
  const dispatch= useDispatch()
  console.log();
  const classes = dailyLogStyle();
  const marks = [
    {
      value: 0,
      label: '0H',
    },
    {
      value: 1,
      label: '1H',
    },
    {
      value: 2,
      label: '2H',
    },
    {
      value: 3,
      label: '3H',
    },
    {
      value: 4,
      label: '4H',
    },
    {
      value: 5,
      label: '5H',
    },
    {
      value: 6,
      label: '6H',
    },
    {
      value: 7,
      label: '7H',
    },
    {
      value: 8,
      label: '8H',
    },
  ];
  function valuetext(value) {
    return `${value} hours`;
  }



const handleChange = (hours,interventionID)=>{
  console.log("changingggggh");
  dispatch(

    updateUserGeneralTasksHours({ id: interventionID, hours: hours })
  );
}

  return (
    <div
      className={`${classes.taskItem}
    ${
      dayjs(task?.dueDate)
        .startOf("day")
        .locale("en-gb")
        .isSame(dayjs().startOf("day").locale("en-gb")) && "danger"
    }

    `}
    >
      <div className="project-name">{project?.customId}</div>
      <div className="task-name">{task?.name}</div>
      <div className="tache-state">
        {
          TASK_STATE_TRANSLATION.filter(
            (trans) => trans.label === task.state
          )[0]?.value
        }
      </div>
      {hours !== undefined ? (
        <Slider

          marks={marks}
          color="secondary"
          getAriaValueText={valuetext}
          size="small"
          valueLabelDisplay="auto"
          data-project-id={project.id}
          data-task-id={task.id}
          className="slider"
          aria-label="nombre des heurs"
          min={0}
          max={8}
          step={1}
          value={hours}
          onChange={(event,value)=>handleChange(value,id)}
          onChangeCommitted={(event, value) =>
            handleChangeSubmit(value, project.id, task.id, id)
          }
        />
      ) : (
        !joinDisabled && (
          <button
            data-task-id={task.id}
            data-project-id={project.id}
            onClick={joinTask}
            className={classes.joinBtn}
          >
            <CustomJoinIcon className={classes.icon} />
          </button>
        )
      )}
    </div>
  );
};

export default TaskItem;
