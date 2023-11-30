import React from "react";
import { useDispatch } from "react-redux";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { useAssociateToTaskMutation } from "../../../store/api/tasks.api";
import { updateUserPotentialTasks } from "../../../store/reducers/task.reducer";
import { notify } from "../notification/notification";
import TaskItem from "./TaskItem";

const JoinableTasks = () => {
  const dispatch = useDispatch()
  const joinableTasks = useGetStateFromStore("task", "userPotentialTasks");

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
      dispatch(updateUserPotentialTasks(parseInt(taskID)))
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  return (
    <div>
      {joinableTasks.map((joinable, key) => (
        <TaskItem key={key} project={joinable?.project} task={joinable?.task}
        joinTask={joinTask}
        />
      ))}
    </div>
  );
};

export default JoinableTasks;
