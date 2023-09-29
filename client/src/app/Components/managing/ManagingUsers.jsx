import {
  faCircleInfo,
  faUserLock,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useGetUsersList from "../../../hooks/manage/usersList";
import {
  useAddNewUserMutation,
  useGetUserListMutation
} from "../../../store/api/users.api";
import {
  addNewUSerToList,
  setUsersList
} from "../../../store/reducers/manage.reducer";
import AddBtn from "./AddBtn";
//modal

import { ToastContainer, toast } from "react-toastify";
import { EMPLOYEE_ROLE } from "../../../constants/roles";
import AddUserForm from "./AddUserForm";
import { notify } from "../notification/notification";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import { listStyle } from "./style";

// ];

const newUserInitialState = {
  account: {
    email: "",
    role: EMPLOYEE_ROLE
  },
  profile: {
    name: "",
    lastName: ""
  }
};

const ManagingUsers = () => {
  const [getUserList, {}] = useGetUserListMutation();
  const usersList = useGetUsersList();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState(newUserInitialState);
  const [addNewUser, { isLoading }] = useAddNewUserMutation();
  const dispatch = useDispatch();
  const classes = listStyle();

  useEffect(() => {
    async function userList() {
      try {
        const res = await getUserList().unwrap();
        dispatch(setUsersList(res.users));
      } catch (error) {
        console.log(error);
      }
    }

    userList();
  }, []);

  useEffect(() => {
    if (usersList.length) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [usersList]);

  const handleModelOpen = () => {
    setNewUser(newUserInitialState);
    setOpenModal(true);
  };
  const handleModelClose = () => {
    setNewUser(newUserInitialState);
    setOpenModal(false);
  };

  const handleChangeAccount = (e) => {
    setNewUser({
      ...newUser,
      account: { ...newUser.account, [e.target.name]: e.target.value }
    });
  };
  const handleChangeProfile = (e) => {
    setNewUser({
      ...newUser,
      profile: { ...newUser.profile, [e.target.name]: e.target.value }
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await addNewUser(newUser).unwrap();
      if (res?.createdUSer) {
        const { createdUSer, message } = res;
        if (createdUSer) dispatch(addNewUSerToList(createdUSer));
        notify(NOTIFY_SUCCESS, message);
        setNewUser(newUserInitialState);
        handleModelClose();
      }
    } catch (error) {
      notify(NOTIFY_ERROR, error.data?.message);
    }
  };

  //column for the header of the list
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "First name",
      width: 200,
      editable: true
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 200,
      editable: true
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true
    },
    {
      field: "role",
      headerName: "Role",
      width: 200,
      editable: true
    },
    {
      field: "active",
      headerName: "Status",
      width: 250,
      // editable:true,
      renderCell: (params) => {
        const active = params.row?.active;
        if (active) {
          return <span className={classes.safeLabel}>active</span>;
        } else {
          return <span className={classes.redLabel}>inactive</span>;
        }
      }
    },
    {
      field: "isBanned",
      headerName: "Banned",
      width: 200,
      renderCell: (params) => {
        const isBanned = params.row?.isBanned;
        if (isBanned) {
          return <span className={classes.redLabel}>yes</span>;
        } else {
          return <span className={classes.safeLabel}>no</span>;
        }
      }
    },
    {
      field: "actions", // Add a field for actions
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        const id = params.row.id;
        // Render custom buttons for each row
        return (
          <div>
            <button
              onClick={() => console.log("here")}
              alt={`block the user ${id}`}
            >
              <FontAwesomeIcon icon={faUserLock} />
            </button>
            {/* <button
            onClick={() => {
              // Replace 'id' with your actual identifier field
              const id = params.row.id;
              window.location.href = `/id/${id}`;
            }}
          > */}
            <Link to={`${id}`} title={`see the details of the user ${id}`}>
              <FontAwesomeIcon icon={faCircleInfo} />
            </Link>
            {/* </button> */}
          </div>
        );
      }
    }
  ];
  return (
    <Grid container>
      <AddUserForm
        open={openModal}
        handleClose={handleModelClose}
        handleSubmit={handleAddUser}
        changeStateAccount={handleChangeAccount}
        changeStateProfile={handleChangeProfile}
      />
      <Grid item xs={12} md={12} lg={12}>
        <AddBtn
          title="Add a user"
          icon={faUserPlus}
          handleAdd={handleModelOpen}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={usersList}
            columns={columns}
            loading={loading}
            autoHeight={true}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10
                }
              }
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </Grid>
      <ToastContainer
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
      />
    </Grid>
  );
};

export default ManagingUsers;
