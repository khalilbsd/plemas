import { Skeleton, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { ReactSVG } from "react-svg";
import {
  NOTIFY_ERROR,
  NOTIFY_SUCCESS,
  TASK_STATES,
  TASK_STATE_TRANSLATION
} from "../../../constants/constants";
import useIsUserCanAccess from "../../../hooks/access";
import useGetAuthenticatedUser from "../../../hooks/authenticated";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import {
  useAssignHoursInTaskMutation,
  useAssociateToTaskMutation,
  useGetProjectTasksMutation,
  useUpdateTaskMutation
} from "../../../store/api/tasks.api";
import { setProjectTask } from "../../../store/reducers/task.reducer";
import { ReactComponent as FaClock } from "../../public/svgs/light/clock.svg";
import { ReactComponent as FaSave } from "../../public/svgs/light/floppy-disk.svg";
import { ReactComponent as FaEdit } from "../../public/svgs/light/pen.svg";
import { ReactComponent as FaJoin } from "../../public/svgs/light/user-plus.svg";
import { ReactComponent as FaCancel } from "../../public/svgs/light/xmark.svg";
import faAdd from "../../public/svgs/solid/plus.svg";
import { notify } from "../notification/notification";
import ProjectIntervenant from "./ProjectIntervenant";
import { projectDetails, projectTaskDetails } from "./style";

// const CustomSaveIcon = () => (
//   <FaSave width={24} height={24} /> // Customize the width and height as needed
// );

const CustomSaveIcon = ({ className }) => (
  <FaSave className={className} /> // Customize the width and height as needed
);
const CustomClockIcon = ({ className }) => (
  <FaClock className={className} /> // Customize the width and height as needed
);
const CustomJoinIcon = ({ className }) => (
  <FaJoin className={className} /> // Customize the width and height as needed
);
const CustomCancelIcon = ({ className }) => (
  <FaCancel className={className} /> // Customize the width and height as needed
);
const CustomEditIcon = ({ className }) => (
  <FaEdit className={className} /> // Customize the width and height as needed
);

const ProjectTasks = ({ openAddTask }) => {
  const { projectID } = useParams();
  const dispatch = useDispatch();
  const tasks = useGetStateFromStore("task", "projectTasks");
  const project = useGetStateFromStore("project", "projectDetails");
  const [associateToTask] = useAssociateToTaskMutation();
  const [getProjectTasks] = useGetProjectTasksMutation();
  const [assignHoursInTask] = useAssignHoursInTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const classes = projectTaskDetails();
  const classesDetails = projectDetails();
  const { user } = useGetAuthenticatedUser();
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const [reloadingIntervenants, setReloadingIntervenants] = useState(false);
  const [hours, setHours] = useState(false);
  const [nbHours, setNbHours] = useState({ taskID: "", nbHours: 0 });

  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleHoursOpen = (e) => {
    const hours = e.currentTarget.getAttribute("data-task-hours");
    const task = e.currentTarget.getAttribute("data-task-id");
    setNbHours({ hours: hours, taskID: task });
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
    setNbHours({ ...nbHours, hours: e.target.value });
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id, isIntervenant) => () => {
    if (user?.email && isIntervenant) {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
      return;
    }
    if (isSuperUser) {
    }
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });
  };

  const processRowUpdate = async (newRow) => {
    try {
      if (newRow.startDate > newRow.dueDate) {
        notify(
          NOTIFY_ERROR,
          "la date d'échéance doit être supérieure à la date de début"
        );
        return;
      }
      let obj={};
      if (
        isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email)
      ) {
        obj = { ...newRow };
      }
      obj.state = newRow.state;
      const res = await updateTask({ body: obj, taskID: newRow.id }).unwrap();
      const updatedRow = { ...newRow, isNew: false };
      notify(NOTIFY_SUCCESS, res?.message);

      return updatedRow;
    } catch (error) {
      notify(NOTIFY_ERROR, error?.message);
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Define custom date formatting function
  const customDateFormat = (date) => {
    // Customize the date formatting according to your locale
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const columns = [
    {
      field: "startDate",
      headerName: "Debut",
      type: "date",
      width: 150,
      editable:
        isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email),

      valueGetter: (params) => {
        return dayjs(params.row.startDate).toDate();
      }
    },
    {
      field: "dueDate",
      headerName: "Échéance",
      type: "date",
      width: 150,
      editable:
        isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email),
      valueGetter: (params) => dayjs(params.row.dueDate).toDate()
    },
    {
      field: "name",
      headerName: "Taches",
      editable:
        isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email),

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
      width: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: TASK_STATES,

      renderCell:(params)=>{
        const taskStatus= TASK_STATE_TRANSLATION.filter(state=>state?.value === params.row?.state)[0]?.label
        return (<span className={`${classes.task} ${taskStatus}`}>{params.row.state}</span>)
    }
  },
    {
      field: "totalHours",
      headerName: "Heures",
      width: 100,
      valueGetter: (params) => `${params.row.totalHours || 0}`
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const renderActions = [];
        if (!user?.email)
          return [<Skeleton className={classes.joinBtnSkeleton} />];

        const emailsList = row.intervenants?.map(
          (worker) => worker?.user?.email
        );

        if (!emailsList?.includes(user?.email)) {
          renderActions.push(
            <GridActionsCellItem
              data-task-id={row.id}
              icon={<CustomJoinIcon className={classes.icon} />}
              label="Joindre tache"
              className="textPrimary"
              onClick={joinTask}
              color="inherit"
            />
          );
        }

        const taskHours = row?.intervenants?.filter(
          (item) => item.user?.email === user?.email
        )[0];

        if (emailsList?.includes(user?.email) && taskHours) {
          renderActions.push(
            <>
              <GridActionsCellItem
                data-task-id={row.id}
                data-task-hours={taskHours.nbHours}
                icon={<CustomClockIcon className={classes.icon} />}
                label="renseigner heurs"
                className="textPrimary"
                onClick={handleHoursOpen}
                color="inherit"
              />

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
                    inputProps={{ min: 0 }}
                  />
                  <buttonKU
                    className={classes.persistHours}
                    onClick={assignHours}
                  >
                    confirmer
                  </buttonKU>
                </DialogContent>
                <DialogActions></DialogActions>
              </Dialog>
            </>
          );
        }

        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          renderActions.push(
            <GridActionsCellItem
              icon={<CustomSaveIcon className={classes.icon} />}
              label="Save"
              sx={{
                color: "primary.main"
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CustomCancelIcon className={classes.icon} />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          );
        } else if (
          isSuperUser ||
          emailsList?.includes(user?.email) ||
          (isManager && user?.email === project?.managerDetails?.email)
        ) {
          renderActions.push(
            <GridActionsCellItem
              icon={<CustomEditIcon className={classes.icon} />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(
                row.id,
                emailsList?.includes(user?.email)
              )}
              color="inherit"
            />
          );
        }
        return renderActions;
      }
    }
  ];

  const localeText = {
    dateFormat: customDateFormat
  };

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
        localeText={localeText}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5
            }
          }
        }}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        onProcessRowUpdateError={(error) => notify(NOTIFY_ERROR, error.message)}
      />
    </div>
  );
};

export default ProjectTasks;
