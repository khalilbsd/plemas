import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { useAssociateToTaskMutation } from "../../../store/api/tasks.api";
import { updateUserPotentialTasks } from "../../../store/reducers/task.reducer";
import { notify } from "../notification/notification";
import TaskItem from "./TaskItem";
import TextField from "@mui/material/TextField";
const JoinableTasks = () => {
  const dispatch = useDispatch();
  const joinableTasks = useGetStateFromStore("task", "userPotentialTasks");
  const [filter, setFilter] = useState("");
  const [associateToTask] = useAssociateToTaskMutation();

  const joinTask = async (e) => {
    try {
      const taskID = e.currentTarget.getAttribute("data-task-id");
      const projectID = e.currentTarget.getAttribute("data-project-id");
      const associated = await associateToTask({
        body: { taskID },
        projectID
      }).unwrap();
      notify(NOTIFY_SUCCESS, associated.message);
      dispatch(updateUserPotentialTasks(parseInt(taskID)));
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };


  const getJoinableTasks =()=>{
    if (!filter) return  joinableTasks

    return joinableTasks.filter(joinableTask => {
      const { task, project } = joinableTask;

      // Replace the conditions below with your specific filtering criteria
      const nameMatch = task?.name?.toLowerCase().includes(filter.toLowerCase());
      const projectIDMatch = project?.customId?.toString().includes(filter);

      // Use logical OR (||) to check if any one of the conditions is true
      return nameMatch || projectIDMatch ;
    });
  }

  return (
    <div>
      <TextField
      sx={{marginBottom:2}}
      size="small"
        label="filter"
        variant="outlined"
        value={filter}
        onChange={handleFilter}
      />

      {getJoinableTasks().map((joinable, key) => (
        <TaskItem
          key={key}
          project={joinable?.project}
          task={joinable?.task}
          joinTask={joinTask}
        />
      ))}
    </div>
  );
};

export default JoinableTasks;
