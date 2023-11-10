import React from "react";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { dailyLogStyle } from "../../dailylog/style";
import TaskItem from "./TaskItem";
import { useAssociateToTaskMutation } from "../../../store/api/tasks.api";
import { notify } from "../notification/notification";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import { useDispatch } from "react-redux";
import { updateUserPotentialTasks } from "../../../store/reducers/task.reducer";

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
