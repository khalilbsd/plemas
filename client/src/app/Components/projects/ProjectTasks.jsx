import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { ReactSVG } from "react-svg";
import useIsUserCanAccess from "../../../hooks/access";
import useGetAuthenticatedUser from "../../../hooks/authenticated";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { formattedDate } from "../../../store/utils";
import faAdd from "../../public/svgs/solid/plus.svg";
import ProjectIntervenant from "./ProjectIntervenant";
import { projectDetails, projectTaskDetails } from "./style";
import { Skeleton } from "@mui/material";
import {
  useAssociateToTaskMutation,
  useGetProjectTasksMutation,
  useAssignHoursInTaskMutation
} from "../../../store/api/tasks.api";
import { notify } from "../notification/notification";
import {
  NOTIFY_ERROR,
  NOTIFY_INFO,
  NOTIFY_SUCCESS
} from "../../../constants/constants";
import { setProjectTask } from "../../../store/reducers/task.reducer";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button, TextField } from "@mui/material";

const ProjectTasks = ({ openAddTask }) => {
  const { projectID } = useParams();
  const dispatch = useDispatch();
  const tasks = useGetStateFromStore("task", "projectTasks");
  const project = useGetStateFromStore("project", "projectDetails");
  const [associateToTask, { isLoading: associatingToTask }] =
    useAssociateToTaskMutation();
  const [getProjectTasks] = useGetProjectTasksMutation();
  const [assignHoursInTask] = useAssignHoursInTaskMutation();
  const classes = projectTaskDetails();
  const classesDetails = projectDetails();
  const { user } = useGetAuthenticatedUser();
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const [reloadingIntervenants, setReloadingIntervenants] = useState(false);
  const [hours, setHours] = useState(false);
  const [nbHours, setNbHours] = useState({taskID:"",nbHours:0});
  const hoursRef = useRef();


  const handleHoursOpen = (e) => {
    const hours = e.currentTarget.getAttribute("data-task-hours");
    const task = e.currentTarget.getAttribute("data-task-id");
    setNbHours({hours:hours,taskID:task})
    setHours(true);
  };

  const handleHoursClose = () => {
    setHours(false);
  };

  const joinTask = async (e) => {
    try {
      const taskID = e.currentTarget.getAttribute("data-task-id");

      const associated = await associateToTask({
        body: { taskID },
        projectID
      }).unwrap();
      notify(NOTIFY_SUCCESS, associated.message);
      setReloadingIntervenants(true);
      const res = await getProjectTasks(projectID).unwrap();
      dispatch(setProjectTask(res?.intervenants));
      setTimeout(() => {
        setReloadingIntervenants(false);
      }, 500);
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const assignHours = async (e) => {
    try {
      const taskID = e.currentTarget.getAttribute("data-task-id");

      const assigned = await assignHoursInTask({
        body: nbHours,
        projectID
      }).unwrap();
      notify(NOTIFY_SUCCESS, assigned.message);
      const res = await getProjectTasks(projectID).unwrap();
      dispatch(setProjectTask(res?.intervenants));
      handleHoursClose();
      setNbHours(0);
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const handleHoursChange = (e) => {
    setNbHours({...nbHours,hours:e.target.value});
  };

  const columns = [
    {
      field: "startDate",
      headerName: "Debut",
      width: 150,
      valueGetter: (params) => `${formattedDate(params.row.startDate)}`
    },
    {
      field: "dueDate",
      headerName: "Échéance",
      width: 150,
      valueGetter: (params) => `${formattedDate(params.row.dueDate)}`
    },
    {
      field: "name",
      headerName: "Taches",
      width: 600
    },
    {
      field: "intervenants",
      headerName: "Intervenants",
      width: 300,
      renderCell: (params) => {
        if (reloadingIntervenants)
          return <Skeleton className={classes.intervenantsSkeleton} />;
        return (
          <ProjectIntervenant
            taskId={params.row.id}
            taskIntervenants={params.row.intervenants}
          />
        );
      }
    },
    {
      field: "state",
      headerName: "État",
      width: 150
      // renderCell:(params)=>{}
    },
    {
      field: "totalHours",
      headerName: "Heures",
      width: 100,
      valueGetter: (params) => `${params.row.totalHours || 0}`
    },
    {
      field: "",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        const emailsList = params.row.intervenants.map(
          (worker) => worker?.user?.email
        );
        if (!user) return <Skeleton className={classes.joinBtnSkeleton} />;
        if (!emailsList.includes(user?.email)) {
          return (
            <button
              data-task-id={params.row.id}
              onClick={joinTask}
              className={classes.joiBtn}
            >
              Joindre tache
            </button>
          );
        }
        const { nbHours: taskHours } = params.row.intervenants.filter(
          (item) => item.user.email === user.email
        )[0];

        if (emailsList.includes(user?.email)) {
          return (
            <>
              <button
                data-task-id={params.row.id}
                data-task-hours={taskHours}
                onClick={handleHoursOpen}
                className={classes.joiBtn}
              >
                renseigner heurs
              </button>
              <Dialog
                open={hours}
                onClose={handleHoursClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Renseigner votre heurs
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Vous pouvez renseigner votre heurs ici
                  </DialogContentText>
                  <TextField
                    label="heurs"
                    type="number"
                    className={classes.inputs}
                    onChange={handleHoursChange}
                    defaultValue={nbHours.hours}
                    inputProps={{min:0}}

                  />
                  <button
                    className={classes.persistHours}
                    onClick={assignHours}
                  >
                    confirmer
                  </button>
                </DialogContent>
                <DialogActions></DialogActions>
              </Dialog>
            </>
          );
        }

        return null;
        // if(params.row.intervenants.map(=>))
      }
    }
  ];

  return (
    <div className={classesDetails.card}>
      {(isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email)) && (
        <div className={`${classesDetails.actions} pr`}>
          <button onClick={openAddTask}>
            <ReactSVG src={faAdd} />
            <span className="text">Ajouter</span>
          </button>
        </div>
      )}
      <DataGrid
        rows={tasks || []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10
            }
          }
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default ProjectTasks;
