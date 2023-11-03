import React, { useEffect, useState } from "react";
import { projectTaskDetails } from "./style";
import { Grid, TextField } from "@mui/material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  useCreateTaskMutation,
  useGetTaskPotentialIntervenantsMutation
} from "../../../store/api/tasks.api";
import { notify } from "../notification/notification";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setTaskCreationPotentielIntervenants, updateProjectTask } from "../../../store/reducers/task.reducer";
import ProjectUserLists from "./ProjectUserLists";
import { projectsStyles } from "../managing/style";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import faSave from "../../public/svgs/light/floppy-disk.svg";
import faClose from "../../public/svgs/light/xmark.svg";
import { ReactSVG } from "react-svg";
import Loading from "../loading/Loading";

const ProjectTaskAdd = ({ closeAddTask }) => {
  const classes = projectTaskDetails();
  const externalProjectClasses = projectsStyles();
  const taskPotentials = useGetStateFromStore(
    "task",
    "taskPotentielIntervenants"
  );
  const { projectID } = useParams();
  const dispatch = useDispatch();
  const [task, setTask] = useState({
    name: "",
    startDate: dayjs(new Date()),
    dueDate: dayjs(new Date()),
    intervenants: []
  });

  const [getTaskPotentialIntervenants] =
    useGetTaskPotentialIntervenantsMutation();
  const [createTask, { isLoading: creatingTask }] = useCreateTaskMutation();

  async function loadTaskPotentialIntervenants() {
    try {
      const res = await getTaskPotentialIntervenants({ projectID }).unwrap();
      dispatch(setTaskCreationPotentielIntervenants(res?.potentials));
    } catch (error) {
      console.log(error);
      notify(NOTIFY_ERROR, error?.data.message);
    }
  }

  useEffect(() => {
    loadTaskPotentialIntervenants();
  }, []);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleIntervenantsChange = (event) => {
    const {
      target: { value }
    } = event;
    setTask({
      ...task,
      intervenants:
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
    });
  };

  const handleClose = () => {
    setTask({
      name: "",
      startDate: dayjs(new Date()),
      dueDate: dayjs(new Date()),
      intervenants: []
    });
    closeAddTask();
  };
  // dayjs(data.startDate).format("DD/MM/YYYY");
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const data = { ...task };
      data.startDate = dayjs(data.startDate).format("DD/MM/YYYY");
      data.dueDate = dayjs(data.dueDate).format("DD/MM/YYYY");
      if (data.intervenants.length) {
        data.intervenants = data.intervenants.map((user) => user.email);
      } else {
        delete data.intervenants;
      }
      const res = await createTask({ body: data, projectID }).unwrap();
      notify(NOTIFY_SUCCESS, res?.message);
      dispatch(updateProjectTask(res.task))
      closeAddTask();
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  return (
    <div className={classes.addTaskForm}>
      <form onSubmit={handleCreateTask}>
        <Grid container spacing={2}>
          <div className={externalProjectClasses.modalActionBtn}>
            {!creatingTask ? (
              <>
                <button className="submit">
                  <ReactSVG src={faSave} />
                </button>
                <button className="close" type="reset" onClick={handleClose}>
                  <ReactSVG src={faClose} />
                </button>
              </>
            ) : (
              <Loading color="var(--orange)" />
            )}
          </div>
          <Grid item xs={12} sm={12} md={4} lg={5}>
            <TextField
              className={classes.inputs}
              name="name"
              onChange={handleChange}
              label="Tache"
              required
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className={classes.inputs}
                label="Date début du tache"
                // value={newProject.startDate}
                defaultValue={task.startDate}
                onChange={(newValue) => {
                  setTask({ ...task, startDate: newValue });
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                // className={externalClasses.inputs}
                label="Échéance du tache"
                // value={newProject.startDate}
                className={classes.inputs}
                defaultValue={task.dueDate}
                onChange={(newValue) => {
                  setTask({ ...task, dueDate: newValue });
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <ProjectUserLists
              externalClass={externalProjectClasses}
              multiple={true}
              list={taskPotentials}
              multipleValue={task.intervenants}
              handleChange={handleIntervenantsChange}
              label="Intervenants"
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default ProjectTaskAdd;
