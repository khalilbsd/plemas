import { TextField } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes
} from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { ReactSVG } from "react-svg";
import {
  NOTIFY_ERROR,
  NOTIFY_INFO,
  NOTIFY_SUCCESS,
  REQUEST_STATES_LABELS,
  REQUEST_STATES_NOT_TREATED,
  REQUEST_STATE_TRANSLATION
} from "../../../constants/constants";
import useIsUserCanAccess from "../../../hooks/access";
import useGetAuthenticatedUser from "../../../hooks/authenticated";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import {
  useCreateProjectRequestMutation,
  useDeleteProjectRequestMutation,
  useGetProjectRequestMutation,
  useUpdateProjectRequestMutation
} from "../../../store/api/requests.api";
import {
  removeRequestFromList,
  setProjectRequests,
  updateRequestList
} from "../../../store/reducers/project.reducer";
import { formattedDate } from "../../../store/utils";
import faSave from "../../public/svgs/light/floppy-disk.svg";
import faAdd from "../../public/svgs/light/plus.svg";
import PopUp from "../PopUp.jsx/PopUp";
import CustomDataGridHeaderColumnMenu from "../customDataGridHeader/CustomDataGridHeaderColumnMenu";
import { CustomCancelIcon, CustomDeleteIcon, CustomEditIcon, CustomSaveIcon } from "../icons";
import { notify } from "../notification/notification";
import { projectDetails, projectTaskDetails } from "./style";
import CustomNoRowsOverlay from "../NoRowOverlay/CustomNoRowsOverlay";



const ProjectRequests = () => {
  const dispatch = useDispatch();
  const { projectID } = useParams();
  const project = useGetProjectRequestMutation("project", "projectDetails");
  const classesDetails = projectDetails();
  const taskStyles = projectTaskDetails();
  const [addRequest, setAddRequest] = useState(false);
  const { user } = useGetAuthenticatedUser();
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const [creatingRequest, setCreatingRequest] = useState(false)
  const requests = useGetStateFromStore("project", "projectRequest");
  const [getProjectRequest, { isLoading: loadingRequests }] =
    useGetProjectRequestMutation();
  const [updateProjectRequest, { isLoading: updatingRequest }] =
    useUpdateProjectRequestMutation();
  const [createProjectRequest] =
    useCreateProjectRequestMutation();
    const [deleteProjectRequest,{isLoading:deletingRequest}]=
useDeleteProjectRequestMutation()



  const [rowModesModel, setRowModesModel] = React.useState({});

  const descriptionRef = useRef();

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick =  (id) => async () => {
    // setRows(rows.filter((row) => row.id !== id));
    try {
      const res = await deleteProjectRequest({projectID,requestID:id}).unwrap()
      dispatch(removeRequestFromList(id))
      notify(NOTIFY_SUCCESS,res.message)
    } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
    }

  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });
  };

  const processRowUpdate = async (newRow) => {
    try {

      let body = {
        state: REQUEST_STATE_TRANSLATION.filter(
          (state) => state.label === newRow.state
        )[0]?.value,
        description: newRow.description
      };
      const res = await updateProjectRequest({
        projectID,
        requestID: newRow.id,
        body
      }).unwrap();

      const updatedRow = { ...newRow, isNew: false };
      notify(NOTIFY_SUCCESS, res?.message);
      return updatedRow;
    } catch (error) {
      console.log(error);
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const requestCreatorsNames=()=>{
    let names =[]
    requests.forEach(item=>{
      if (!names.includes(`${item?.requestCreator?.UserProfile.name} ${item?.requestCreator?.UserProfile.lastName}`)){
        names.push(`${item?.requestCreator?.UserProfile.name} ${item?.requestCreator?.UserProfile.lastName}`)
      }
    })

    return names
  }


  const columns = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 150,
      editable: true,
      valueGetter: (params) => {
        return `${formattedDate(params.row.createdAt)}`;
      }
    },
    {
      field: "description",
      headerName: "Information",
      width: 500,
      editable: true,
      filterable:false
    },
    {
      field: "creatorID",
      headerName: "Émetteur",
      // type: "number",
      valueOptions:requestCreatorsNames,
      type:"singleSelect",
      width: 200,
      renderCell: ({ row }) => {
        return (
          <div className={`${classesDetails.manager} small`}>
            {row.requestCreator?.UserProfile?.image ? (
              <img
                src={`${process.env.REACT_APP_SERVER_URL}${row.requestCreator?.UserProfile?.image}`}
                alt={`avatar for user ${row.requestCreator?.UserProfile?.name}`}
              />
            ) : (
              <span className="initials">
                {row.requestCreator?.UserProfile?.name[0]}
                {row.requestCreator?.UserProfile?.lastName[0]}
              </span>
            )}
            <p className="manager-name">
              {row.requestCreator?.UserProfile?.name}
              {row.requestCreator?.UserProfile?.lastName}
              <br />
              {/* <span className="email">
              {row.requestCreator?.email}
            </span> */}
            </p>
          </div>
        );
      }
    },
    {
      field: "state",
      headerName: "État",
      type: "singleSelect",
      valueOptions: REQUEST_STATES_LABELS,
      editable:
        isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email),
      width: 160,
      renderCell: (params) => {
        const status =
          params.row.state === REQUEST_STATES_NOT_TREATED ? "blocked" : "done";
        return (
          <span className={`${taskStyles.task} ${status}`}>
            {params.row.state}
          </span>
        );
      }
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const renderActions = [];
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          renderActions.push(
            <GridActionsCellItem
              icon={<CustomSaveIcon className={taskStyles.icon} />}
              label="Enregistrer"
              sx={{
                color: "primary.main"
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CustomCancelIcon className={taskStyles.icon} />}
              label="Annuler"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          );
        } else {
          if (
            isSuperUser ||
            (isManager && user.email === project?.managerDetails?.email ) || user?.email === row.requestCreator?.email
          ) {
            renderActions.push(
              <GridActionsCellItem
                icon={<CustomEditIcon className={taskStyles.icon} />}
                label="Éditer"
                className="textPrimary"
                onClick={handleEditClick(row.id)}
                color="inherit"
              />
            );
          }
          if (isSuperUser){
            renderActions.push(
              <GridActionsCellItem
              icon={<CustomDeleteIcon className={taskStyles.icon} />}
              label="Supprimer"
              className="textPrimary"
              onClick={handleDeleteClick(row.id)}
              color="inherit"
            />

            )
          }
        }



        return renderActions;
      }
    }
  ];

  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await getProjectRequest(projectID).unwrap();
        dispatch(setProjectRequests(res?.requests));
      } catch (error) {
        notify(NOTIFY_ERROR, error?.data?.message);
      }
    }
    loadRequests();
  }, [dispatch, projectID,getProjectRequest]);

  const openAddRequest = () => {
    setAddRequest(true);
  };
  const closeAddRequest = () => {
    setAddRequest(false);
  };

  const handleSubmitRequest = async () => {
    const description = descriptionRef.current.value;
    if (!description || description.length === 0) {
      notify(
        NOTIFY_INFO,
        "la requête ne sera pas créée parce que la description était vide "
      );
      closeAddRequest();
    }
    try {
      setCreatingRequest(true)
      const res = await createProjectRequest({
        description,
        projectID
      }).unwrap();
      closeAddRequest();
      dispatch(updateRequestList(res.newRequest));
      notify(NOTIFY_SUCCESS, res?.message);
      setTimeout(() => {
        setCreatingRequest(false)
      }, 500);
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
      closeAddRequest();
      setTimeout(() => {
        setCreatingRequest(false)
      }, 500);
    }
  };

  return (
    <div className={classesDetails.card}>
      <div className={`${classesDetails.actions} pr`}>
        <button onClick={openAddRequest}>
          <ReactSVG src={faAdd} />
          <span className="text">Ajouter</span>
        </button>
      </div>
      <PopUp
        open={addRequest}
        handleClose={closeAddRequest}
        handleSubmit={handleSubmitRequest}
        title="Ajouter une requête"
        text="La demande créée aura la date de création comme date de référence, l'état d'avancement ne sera pas traité comme un état par défaut et le créateur sera celui qui l'a créée."
        icon={faSave}
        btnText="Ajouter"
        loading={creatingRequest}
      >
        <TextField
          label="Information"
          name="description"
          inputRef={descriptionRef}
          multiline
          fullWidth
        />
      </PopUp>
      <DataGrid
        loading={loadingRequests || updatingRequest || creatingRequest || deletingRequest}
        slots={{ columnMenu: CustomDataGridHeaderColumnMenu,
          noRowsOverlay: CustomNoRowsOverlay
        }}
        rows={requests}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 3
            }
          }
        }}
        pageSizeOptions={[3]}
        disableRowSelectionOnClick
        onProcessRowUpdateError={(error) => notify(NOTIFY_ERROR, error.message)}
        autoHeight
        sx={{ "--DataGrid-overlayHeight": "200px" }}

      />
    </div>
  );
};

export default ProjectRequests;
