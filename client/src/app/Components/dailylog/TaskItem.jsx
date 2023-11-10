import React from "react";
import { dailyLogStyle } from "../../dailylog/style";

import Slider from "@mui/material/Slider";
import { TASK_STATE_TRANSLATION } from "../../../constants/constants";
import { CustomJoinIcon } from "../icons";
import dayjs from "dayjs";

const TaskItem = ({
  hours,
  task,
  project,
  handleChangeSubmit,
  id,
  joinTask,
  joinDisabled
}) => {
  //   const handleChange = () => {};
  console.log()
  const classes = dailyLogStyle();
  return (
    <div className={`${classes.taskItem}
    ${
      dayjs(task?.dueDate).startOf('day').locale('en-gb').isSame(dayjs().startOf('day').locale('en-gb'))&&
      'danger'
    }

    `}>
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
        marks
        color="secondary"
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
          // onChange={(event,value)=>handleChange(value,id)}
          onChangeCommitted={(event, value) =>
            handleChangeSubmit(value, project.id, task.id, id)
          }
        />
      ) : (
        !joinDisabled&&
        <button
          data-task-id={task.id}
          data-project-id={project.id}
          onClick={joinTask}
          className={classes.joinBtn}
        >
          <CustomJoinIcon className={classes.icon} />
        </button>
      )}
    </div>
  );
};

export default TaskItem;
