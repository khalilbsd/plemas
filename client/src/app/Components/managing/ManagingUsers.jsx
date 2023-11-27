import {
  Grid,
  MenuItem,
  Select,
  Switch
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useGetUsersList from "../../../hooks/manage/usersList";
import {
  useAddNewUserMutation,
  useBanUserMutation,
  useChangeRoleMutation,
  useGetUserListMutation,
  useUnBanUserMutation
} from "../../../store/api/users.api";
import {
  addNewUSerToList,
  setUsersList,
  updateUserInList
} from "../../../store/reducers/manage.reducer";
import AddBtn from "./AddBtn";
//modal

import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import {
  CLIENT_ROLE,
  INTERVENANT_ROLE,
  PROJECT_MANAGER_ROLE,
  SUPERUSER_ROLE
} from "../../../constants/roles";
import faSave from "../../public/svgs/light/floppy-disk.svg";
import faAddUser from "../../public/svgs/light/user-plus.svg";
import PopUp from "../PopUp/PopUp.jsx";
import { notify } from "../notification/notification";
import AddUserForm from "./AddUserForm";
import { listStyle } from "./style";

// ];

const newUserInitialState = {
  account: {
    email: "",
    role: INTERVENANT_ROLE
  },
  profile: {
    name: "",
    lastName: ""
  }
};
const label = { inputProps: { "aria-label": "bannir l'utilisateur" } };

const ManagingUsers = () => {
  const [getUserList] = useGetUserListMutation();
  const usersList = useGetUsersList();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [newUser, setNewUser] = useState(newUserInitialState);
  const [addNewUser] = useAddNewUserMutation();
  const [banUser,{isLoading:banningUser}] = useBanUserMutation();
  const [unBanUser] = useUnBanUserMutation();
  const [changeRole,{isLoading:changingUserRole}] = useChangeRoleMutation();
  const dispatch = useDispatch();
  const [roleChange, setRoleChange] = useState({ email: "", state: false });
  const classes = listStyle();
  const [confirmRoleChange, setConfirmRoleChange] = useState(false)
  const [confirmBanUser, setConfirmBanUser] = useState(false)
  const [userRole, setUserRole] = useState({role:undefined,email:undefined})
  const [userToBan, setUserToBan] = useState({ban:undefined,email:undefined})

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
  }, [getUserList,dispatch]);

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
    setTimeout(() => {
      setLoadingSubmit(false);

    }, 300);
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

  const handleBanUser = async (e) => {
    try {
      let resp;

      dispatch(
        updateUserInList(userToBan)
      );
      if (!e.target.checked) {
        resp = await banUser({ email:userToBan.email}).unwrap();
      } else {
        resp = await unBanUser({ email:userToBan.email }).unwrap();
      }
      closeConfirmBanUser()
      notify(NOTIFY_SUCCESS, resp?.message);

    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const getSelectRoleForUser = (email) => {
    if (roleChange.email === email) return true;
    return false;
  };




  const loadRoleChangeInput = (email) => {
    setRoleChange({
      email: email.currentTarget.getAttribute("data-email"),
      state: true
    });
  };



  const handleRoleChange = async () => {
    try {

      const resp = await changeRole(userRole).unwrap()
      dispatch(updateUserInList(userRole))
      notify(NOTIFY_SUCCESS,resp?.message)
      setRoleChange({
        email: "",
        state: false
      });
      setConfirmRoleChange(false)
      setUserRole({email:undefined,role:undefined})

    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const handleConfirmBanUser=(ban,email)=>{
    setUserToBan({email,ban})
    setConfirmBanUser(true)
  }
  const closeConfirmBanUser=()=>{
    setConfirmBanUser(false)
    setUserToBan({email:undefined,ban:undefined})
  }
  const handleConfirmRoleChange =(newRole,email)=>{
    setUserRole({email:email,role:newRole})
    setConfirmRoleChange(true)
  }

const closeConfirmRoleChange=()=>{
  setConfirmRoleChange(false)
  setUserRole({email:undefined,role:undefined})
}

  //column for the header of the list
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Nom",
      width: 200,
      editable: false
    },
    {
      field: "lastName",
      headerName: "Prénom",
      width: 200,
      editable: false
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: false
    },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      editable: false,
      renderCell: (params) => {
        const { email, role } = params.row;
        const ch = role === SUPERUSER_ROLE ? "admin" : role.replace('_',' ').toLowerCase();

        return (
          <>
          <PopUp
            loading={changingUserRole}
            open={confirmRoleChange}
            handleClose={closeConfirmRoleChange}
            handleSubmit={handleRoleChange}
            title={"Confirmation"}
            icon={faSave}
            text={`Êtes-vous sûr de vouloir changer l'utilisateur du rôle ${role === SUPERUSER_ROLE ? "admin" : role.replace('_',' ').toLowerCase()} au role de ${userRole?.role?.replace('_',' ')}?
            Gardez à l'esprit que changer le rôle d'un utilisateur aura pour conséquence de lui ajouter/supprimer certains privilèges. `}
            btnText={"Confirmer"}
            btnLevel="danger"
          />
            {getSelectRoleForUser(email) ? (
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={role}
                onChange={(e)=>handleConfirmRoleChange(e.target.value,email)}
                name={email}
                inputProps={{"data-id":email}}
                size="small"
              >
                <MenuItem value={role}>
                  <em>{role === SUPERUSER_ROLE ? "admin" : role}</em>
                </MenuItem>
                {[
                  SUPERUSER_ROLE,
                  INTERVENANT_ROLE,
                  CLIENT_ROLE,
                  PROJECT_MANAGER_ROLE
                ].map(
                  (item) =>
                    item !== role && (
                      <MenuItem value={item} key={item}>
                        {item === SUPERUSER_ROLE ? "admin" : item.replace('_',' ')}
                      </MenuItem>
                    )
                )}
              </Select>
            ) : (
              <button data-email={email} onClick={loadRoleChangeInput} className={classes.roleBtn}>
                {ch}
              </button>
            )}
          </>
        );
      }
    },
    {
      field: "active",
      headerName: "Statut",
      width: 250,
      // editable:true,
      renderCell: (params) => {
        const active = params.row?.active;
        if (active) {
          return <span className={classes.safeLabel}>Vérifié</span>;
        } else {
          return <span className={classes.redLabel}>non-vérifié</span>;
        }
      }
    },
    {
      field: "isBanned",
      headerName: "Actif",
      width: 200,
      renderCell: (params) => {
        const isBanned = params.row?.isBanned;
        const email = params.row?.email;
        return (
          <>
            <PopUp
            loading={banningUser}
            open={confirmBanUser}
            handleClose={closeConfirmBanUser}
            handleSubmit={handleBanUser}
            title={"Confirmation"}
            icon={faSave}
            text={`êtes-vous sûr de vouloir bannir l'utilisateur ${userToBan.email} du système ?
            Gardez à l'esprit que le bannissement de l'utilisateur entraînera la suppression de tout accès au système. Cependant, les données antérieures de l'utilisateur resteront intactes.`}
            btnText={"Confirmer"}
            btnLevel="danger"
          />
          <Switch
            {...label}
            value={isBanned}
            checked={!isBanned}
            id={email}
            onChange={(e)=>handleConfirmBanUser(!e.target.checked,email)}

            // defaultValue={isBanned?true:false}
            />
            </>
        );
      }
    }
    // {
    //   field: "actions", // Add a field for actions
    //   headerName: "Actions",
    //   width: 200,
    //   renderCell: (params) => {
    //     const id = params.row.id;
    //     // Render custom buttons for each row
    //     return (
    //       <div>
    //         <button
    //           onClick={() => console.log("here")}
    //           alt={`block the user ${id}`}
    //         >
    //           <FontAwesomeIcon icon={faUserLock} />
    //         </button>
    //         {/* <button
    //         onClick={() => {
    //           // Replace 'id' with your actual identifier field
    //           const id = params.row.id;
    //           window.location.href = `/id/${id}`;
    //         }}
    //       > */}
    //         <Link to={`${id}`} title={`see the details of the user ${id}`}>
    //           <FontAwesomeIcon icon={faCircleInfo} />
    //         </Link>
    //         {/* </button> */}
    //       </div>
    //     );
    //   }
    // }
  ];






  return (
    <Grid container spacing={2} sx={{height:'100%'}}>
      <AddUserForm
        loadingSubmit={loadingSubmit}
        open={openModal}
        handleClose={handleModelClose}
        handleSubmit={handleAddUser}
        changeStateAccount={handleChangeAccount}
        changeStateProfile={handleChangeProfile}
      />
      <Grid item xs={12} md={12} lg={12}  >
        <AddBtn
          title="Ajouter un utilisateur"
          icon={faAddUser}
          handleAdd={handleModelOpen}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12} sx={{height:'100%'}}>

          <DataGrid
          className={classes.list}
            rows={usersList}
            // rows={testGridSupport()}
            columns={columns}
            loading={loading}
            autoHeight={true}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 100
                }
              }
            }}
            pageSizeOptions={[100]}
            disableRowSelectionOnClick
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
