import React from "react";
import { dailyLogStyle } from "../../dailylog/style";

import Slider from "@mui/material/Slider";
import { TASK_STATE_TRANSLATION } from "../../../constants/constants";

const TaskItem = ({ hours, setTaskHours, task, project,handleChangeSubmit,id }) => {
//   const handleChange = () => {};

  const classes = dailyLogStyle();
  return (
    <div className={classes.taskItem}>
      <div className="project-name">{project?.customId}</div>
      <div className="tache-state">
        {
          TASK_STATE_TRANSLATION.filter(
            (trans) => trans.label === task.state
          )[0]?.value
        }
      </div>
      <Slider
        data-project-id={project.id}
        data-task-id={task.id}
        className="slider"
        aria-label="nombre des heurs"
        min={0}
        max={8}
        step={1}
        value={hours}
        // onChange={(event,value)=>handleChange(value,id)}
        onChangeCommitted={(event,value)=>handleChangeSubmit(value,project.id,task.id,id)}
      />
    </div>
  );
};

export default TaskItem;
