import { Skeleton } from "@mui/material";
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
  useAssociateToTaskMutation,
  useGetProjectTasksMutation,
  useUpdateTaskMutation
} from "../../../store/api/tasks.api";
import { setProjectTask } from "../../../store/reducers/task.reducer";

import faAdd from "../../public/svgs/solid/plus.svg";
import { CustomCancelIcon, CustomEditIcon, CustomJoinIcon, CustomSaveIcon } from "../icons";
import { notify } from "../notification/notification";
import ProjectIntervenant from "./ProjectIntervenant";
import { projectDetails, projectTaskDetails } from "./style";



const ProjectTasks = ({ openAddTask }) => {
  const { projectID } = useParams();
  const dispatch = useDispatch();
  const tasks = useGetStateFromStore("task", "projectTasks");
  const project = useGetStateFromStore("project", "projectDetails");
  const [associateToTask] = useAssociateToTaskMutation();
  const [getProjectTasks] = useGetProjectTasksMutation();
  const [updateTask] = useUpdateTaskMutation();

  const classes = projectTaskDetails();
  const classesDetails = projectDetails();
  const { user } = useGetAuthenticatedUser();
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const [reloadingIntervenants, setReloadingIntervenants] = useState(false);

  const [rowModesModel, setRowModesModel] = React.useState({});




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
      notify(NOTIFY_ERROR, error?.data.message);
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
        // if (!user?.email)
        //   return [<Skeleton className={classes.joinBtnSkeleton} />];

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
              pageSize: 4
            }
          }
        }}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        pageSizeOptions={[4]}
        disableRowSelectionOnClick
        onProcessRowUpdateError={(error) => notify(NOTIFY_ERROR, error.message)}
      />
    </div>
  );
};

export default ProjectTasks;
