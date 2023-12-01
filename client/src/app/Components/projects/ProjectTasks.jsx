import { Skeleton } from "@mui/material";

import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { ReactSVG } from "react-svg";
import {
  NOTIFY_ERROR,
  NOTIFY_SUCCESS,
  TASK_STATES,
  TASK_STATE_ABANDONED,
  TASK_STATE_BLOCKED,
  TASK_STATE_DONE,
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
import { updateProjectState } from "../../../store/reducers/project.reducer";
import {
  setProjectTask,
  updateSpecificTaskAttribute
} from "../../../store/reducers/task.reducer";

import Tooltip from "@mui/material/Tooltip";
import { frFR } from "@mui/x-data-grid";
import { useWindowSize } from "@uidotdev/usehooks";
import faAdd from "../../public/svgs/solid/plus.svg";
import CustomNoRowsOverlay from "../NoRowOverlay/CustomNoRowsOverlay";
import CustomDataGridHeaderColumnMenu from "../customDataGridHeader/CustomDataGridHeaderColumnMenu";
import {
  CustomCancelIcon,
  CustomCheckIcon,
  CustomEditIcon,
  CustomJoinIcon,
  CustomSaveIcon
} from "../icons";
import { notify } from "../notification/notification";
import ProjectIntervenant from "./ProjectIntervenant";
import TaskFiles from "./TaskFiles";
import { projectDetails, projectTaskDetails } from "./style";
import { CLIENT_ROLE } from "../../../constants/roles";


const ProjectTasks = ({ openAddTask }) => {
  const { projectID } = useParams();
  const dispatch = useDispatch();
  const tasks = useGetStateFromStore("task", "projectTasks");
  const project = useGetStateFromStore("project", "projectDetails");
  const [associateToTask] = useAssociateToTaskMutation();
  const [getProjectTasks] = useGetProjectTasksMutation();
  const [updateTask] = useUpdateTaskMutation();
  // eslint-disable-next-line no-unused-vars
  const size = useWindowSize();
  // const [uploadFileToTask] = useUploadFileToTaskMutation();
  const classes = projectTaskDetails();
  const classesDetails = projectDetails();
  const { user } = useGetAuthenticatedUser();
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const [reloadingIntervenants, setReloadingIntervenants] = useState(false);

  const dataGridRef=useRef()


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
    if (
      (user?.email && isIntervenant) ||
      isSuperUser ||
      (isManager && user?.email === project?.managerDetails?.email)
    ) {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
      return;
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
      let obj = {};
      if (
        isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email)
      ) {
        obj = { ...newRow };
      }
      obj.state = newRow.state;
      const res = await updateTask({
        body: obj,
        taskID: newRow.id,
        projectID: projectID
      }).unwrap();
      const updatedRow = { ...newRow, isNew: false };
      notify(NOTIFY_SUCCESS, res?.message);
      // check is task  status change
      if (newRow.state) {
        let task = tasks.filter((item) => item.id === parseInt(newRow.id))[0];
        if (
          task.state !== newRow.state &&
          (newRow.state === TASK_STATE_BLOCKED ||
            task.state === TASK_STATE_BLOCKED)
        )
          dispatch(
            updateProjectState(
              TASK_STATE_TRANSLATION.filter(
                (state) => state.value === newRow.state
              )[0].label
            )
          );
      }
      return updatedRow;
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data.message);
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };




  // // Define custom date formatting function
  // const customDateFormat = (date) => {
  //   // Customize the date formatting according to your locale
  //   return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  // };

  const handleVerifyClick = async (e) => {
    try {
      const taskID = e.currentTarget.getAttribute("data-task-id");
      await updateTask({
        body: { isVerified: true },
        taskID,
        projectID
      }).unwrap();

      notify(NOTIFY_SUCCESS, "Tache verifier");
      dispatch(
        updateSpecificTaskAttribute({
          taskID,
          attribute: "isVerified",
          value: true
        })
      );
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };
  const columns = [
    {
      field: "dueDate",
      headerName: "Échéance",
      type: "date",
      width: 120,
      editable:
        isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email),
      valueGetter: (params) =>
        dayjs(params.row.dueDate).locale("en-gb").toDate()
    },
    {
      field: "startDate",
      headerName: "Debut",
      format: "DD/MM/YYYY",
      type: "date",
      width: 120,
      editable:
      isSuperUser ||
      (isManager && user?.email === project?.managerDetails?.email),

      valueGetter: (params) => {
        return dayjs(params.row.startDate).locale("en-gb").toDate();
      }
    },
    {
      filterable: false,
      width: dataGridRef.current?.clientWidth - 900,
      // width:size.width -  ,

      field: "name",
      headerName: "Taches",
      editable:
        isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email),
      renderCell: ({ row }) => (
        <Tooltip title={row.name} arrow placement="top">
          <span className={classes.tacheDescription}>{row.name}</span>
        </Tooltip>
      )
    },
    {
      filterable: false,
      editable:false,
      sortable: false,
      field: "",
      headerName: "Attachements",
      width: 150,
      renderCell: (params) => {
        const emailsList = params?.row.intervenants?.map(
          (worker) => worker?.user?.email
        );
        return (
          <TaskFiles
            taskID={params.row.id}
            interventions={params.row.intervenants}
            intervenantList = {emailsList}
          />
        );
      }
    },
    {
      filterable: false,
      sortable: false,
      field: "intervenants",
      headerName: "Intervenants",
      width: 230,
      renderCell: (params) => {
        if (reloadingIntervenants)
          return <Skeleton className={classes.intervenantsSkeleton} />;
        return (
          <ProjectIntervenant
            // downloadTaskFile={downloadTaskFile}
            // uploadFileToTask={uploadFileToTask}
            taskId={params.row.id}
            taskIntervenants={params.row.intervenants}
          />
        );
      }
    },
    {
      filterable: false,
      field: "state",
      headerName: "État",
      width: 100,
      editable: true,
      type: "singleSelect",
      valueOptions: ({ row }) => {
        const emailsList = row.intervenants?.map(
          (worker) => worker?.user?.email
        );
        if (!isSuperUser && !isManager && emailsList?.includes(user?.email))
          return TASK_STATES.filter((state) => state !== TASK_STATE_ABANDONED);
        return TASK_STATES;
      },
      // editable:false,

      renderCell: (params) => {
        const taskStatus = TASK_STATE_TRANSLATION.filter(
          (state) => state?.value === params.row?.state
        )[0]?.label;
        return (
          <span className={`${classes.task} ${taskStatus}`}>
            {params.row.state}
          </span>
        );
      }
    },
    {
      field: "totalHours",
      headerName: "Heures",
      width: 70,
      valueGetter: (params) => `${params.row.totalHours || 0}`
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const renderActions = [];
        // if (!user?.email)
        //   return [<Skeleton className={classes.joinBtnSkeleton} />];

        const emailsList = row.intervenants?.map(
          (worker) => worker?.user?.email
        );

        // if (!emailsList?.includes(user?.email)) {
        //   renderActions.push(
        //     <GridActionsCellItem
        //       data-task-id={row.id}
        //       icon={<CustomJoinIcon className={classes.icon} />}
        //       label="Joindre tache"
        //       className="textPrimary"
        //       onClick={joinTask}
        //       color="inherit"
        //     />
        //   );
        // }
        if (
          (isSuperUser ||
            (isManager && user?.email === project?.managerDetails?.email)) &&
          !row.isVerified &&
          project.state === TASK_STATE_DONE
        ) {
          renderActions.push(
            <GridActionsCellItem
              data-task-id={row.id}
              icon={<CustomCheckIcon className={classes.icon} />}
              label="Vérifier"
              sx={{
                color: "primary.main"
              }}
              onClick={handleVerifyClick}
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
          (emailsList?.includes(user?.email) &&
            TASK_STATE_ABANDONED !== row.state) ||
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
        if (
          !emailsList.includes(user?.email) &&
          TASK_STATE_ABANDONED !== row.state && user?.role !== CLIENT_ROLE
        ) {
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

        return renderActions;
      }
    }
  ];

  const getRowClassName = (params) => {
    // console.log(params.row.state)
    return TASK_STATE_ABANDONED === params.row.state
      ? isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email)
        ? ""
        : "blocked"
      : "";
  };

  // const localeText = {
  //   dateFormat: customDateFormat
  // };

  return (
    <div className={classesDetails.card}>
      {(isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email)) && (
        <div className={`${classesDetails.cardTitle}`}>
          <button onClick={openAddTask}>
            <span className="text">Tache</span>
            <ReactSVG className="icon-container" src={faAdd} />
          </button>
        </div>
      )}

      <DataGrid
      // apiRef={dataGridRef}
      ref={dataGridRef}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        autoHeight
        rows={tasks || []}
        columns={columns}
        // localeText={localeText}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100
            }
          }
        }}
        className={classes.list}
        getRowClassName={getRowClassName}
        slots={{
          columnMenu: CustomDataGridHeaderColumnMenu,
          noRowsOverlay: CustomNoRowsOverlay
        }}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        pageSizeOptions={[100]}
        disableRowSelectionOnClick
        onProcessRowUpdateError={(error) => notify(NOTIFY_ERROR, error.message)}
        sx={{ "--DataGrid-overlayHeight": "180px" }}
        isCellEditable={(params) =>
          isSuperUser ||
          (isManager && user?.email === project?.managerDetails?.email) ||
          ![TASK_STATE_ABANDONED].includes(params.row.state)
        }
      />
    </div>
  );
};

export default ProjectTasks;
