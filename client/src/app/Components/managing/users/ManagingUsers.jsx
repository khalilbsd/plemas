import { Grid } from "@mui/material";
import { DataGrid, GridRowEditStopReasons } from "@mui/x-data-grid";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useAddNewUserMutation,
  useUpdateUserMutation,
} from "../../../../store/api/users.api.js";
import { addNewUSerToList } from "../../../../store/reducers/manage.reducer.js";
import AddBtn from "../AddBtn.jsx";
//modal

import {
  NOTIFY_ERROR,
  NOTIFY_SUCCESS,
} from "../../../../constants/constants.js";
import { INTERVENANT_ROLE } from "../../../../constants/roles.js";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore.js";
import useFetchUserList from "../../../../services/fetchers/usersList.fetch.service.js";
import { useResetUserEmailMutation } from "../../../../store/api/auth/authentification.js";
import faAddUser from "../../../public/svgs/light/user-plus.svg";
import { notify } from "../../notification/notification.js";
import { listStyle } from "../style.js";
import AddUserForm from "./AddUserForm";
import useGetColumns from "./columns.jsx";
import useFetchThirdPartyProviders from "../../../../services/fetchers/thirdPartyProviers.fetch.service.js";

// ];

const newUserInitialState = {
  account: {
    email: "",
    role: INTERVENANT_ROLE,
  },
  profile: {
    name: "",
    lastName: "",
  },
};

const ManagingUsers = () => {
  const isLoadingUsers = useFetchUserList();
  useFetchThirdPartyProviders();
  const thirdPartyProvidersList = useGetStateFromStore(
    "thirdPartyProviders",
    "providersList"
  );
  const usersList = useGetStateFromStore("manage", "userList");
  const [openModal, setOpenModal] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [newUser, setNewUser] = useState(newUserInitialState);
  const [addNewUser] = useAddNewUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const { columns, rowModesModel, handleRowModesModelChange } = useGetColumns();
  const dispatch = useDispatch();
  const classes = listStyle();

  const [resetUserEmail] = useResetUserEmailMutation();

  const handleModelOpen = () => {
    setNewUser(newUserInitialState);
    setOpenModal(true);
  };
  const handleModelClose = () => {
    setNewUser(newUserInitialState);
    setOpenModal(false);
    setTimeout(() => {
      setLoadingSubmit(false);
    }, 300);
  };

  const handleChangeAccount = (e) => {
    setNewUser({
      ...newUser,
      account: { ...newUser.account, [e.target.name]: e.target.value },
    });
  };
  const handleChangeProfile = (e) => {
    setNewUser({
      ...newUser,
      profile: { ...newUser.profile, [e.target.name]: e.target.value },
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      setLoadingSubmit(true);
      const res = await addNewUser(newUser).unwrap();
      if (res?.createdUSer) {
        const { createdUSer, message } = res;
        if (createdUSer) dispatch(addNewUSerToList(createdUSer));
        setNewUser(newUserInitialState);
        handleModelClose();
        notify(NOTIFY_SUCCESS, message);
      }
    } catch (error) {
      handleModelClose();
      notify(NOTIFY_ERROR, error.data?.message);
    }
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleChangeEmail = async (oldEmail, newEmail) => {
    try {
      const res = await resetUserEmail({ oldEmail, newEmail }).unwrap();
      notify(NOTIFY_SUCCESS, res.message);
      return true;
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data.message);
      return false;
    }
  };

  const handleProviderUpdate = async (provider, email) => {
    try {
      const providerId = thirdPartyProvidersList.filter(
        (pro) => pro.name === provider
      )[0]?.id;
      console.log(providerId,provider)
      const res = await updateUser({
        data: { userThirdPartyProvider: providerId },
        email,
      }).unwrap();

      notify(NOTIFY_SUCCESS, res.message);
      return true;
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data.message);
      return false;
    }
  };

  const processRowUpdate = (newRow) => {
    console.log("new row", newRow);
    const user = usersList.filter((user) => newRow.id === user.id)[0];
    const oldEmail = user.email;
    let isEmailDifferent = false;
    let isProviderDifferent = false;

    if (user?.email !== newRow?.email) isEmailDifferent = true;
    //  return user;
    if (user.provider !== newRow.provider) isProviderDifferent = true;
    if (!isEmailDifferent && !isProviderDifferent) return user;
    let isEmailUpdated = false;
    let isProviderUpdated = false;
    if (isEmailDifferent) {
      isEmailUpdated = handleChangeEmail(oldEmail, newRow.email);
    }
    if (isProviderDifferent) {
      isProviderUpdated = handleProviderUpdate(newRow.provider, newRow.email);
    }

    if (isEmailUpdated && isProviderUpdated) {
      const updatedRow = { ...newRow, isNew: false };
      return updatedRow;
    } else {
      if (isEmailUpdated) {
        const updatedRow = { ...newRow, isNew: false };
        updatedRow.provider = user.provider;
        return updatedRow;
      }
      if (isProviderUpdated) {
        const updatedRow = { ...newRow, isNew: false };
        updatedRow.email = user.email;
        return updatedRow;
      }
      return user;
    }
    // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  };

  return (
    <Grid container spacing={2} sx={{ height: "100%" }}>
      <AddUserForm
        loadingSubmit={loadingSubmit}
        open={openModal}
        handleClose={handleModelClose}
        handleSubmit={handleAddUser}
        changeStateAccount={handleChangeAccount}
        changeStateProfile={handleChangeProfile}
      />
      <Grid item xs={12} md={12} lg={12}>
        <AddBtn
          title="Ajouter un utilisateur"
          icon={faAddUser}
          handleAdd={handleModelOpen}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12} sx={{ height: "100%" }}>
        <DataGrid
          className={classes.list}
          rows={usersList}
          // rows={testGridSupport()}
          columns={columns}
          loading={isLoadingUsers}
          autoHeight={true}
          editMode="row"
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          // onCellDoubleClick={(params) => fetchProviders()}
          pageSizeOptions={[100]}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-row .MuiDataGrid-cell:hover": {
              cursor: "pointer !important",
            },
          }}
        />
      </Grid>
      {/* <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      /> */}
    </Grid>
  );
};

export default ManagingUsers;
