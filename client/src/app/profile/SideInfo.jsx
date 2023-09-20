import React, { useRef } from "react";
import useGetUserInfo from "../../hooks/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import Loading from "../Components/loading/Loading";
import { formatDate } from "../../hooks/formatDate";
import UploadImage from "../Components/upload/UploadImage";
import { useState } from "react";
import { styles } from "./style";
import { useUpdateUserProfileMutation } from "../../store/api/users.api";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";







const SideInfo = () => {
  const classes = styles();
  const { user, profile } = useGetUserInfo();
  const [changePassword, setChangePassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [updateUserProfile,{isLoading}] = useUpdateUserProfileMutation()

  // const [userAccount, setUserAccount] = useState(user)
  // const [userProfile, setUserProfile] = useState(profile)
  //ref
  // const emailRef=useRef()
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  //profile Ref attributes
  const nameRef = useRef();
  const lastNameRef = useRef();
  const postRef = useRef();
  const phoneRef = useRef();

  const [edit, setEdit] = useState(false);
  if (!user || !profile) return <Loading />;

  // console.log(userAccount,userProfile);
  const handleEdit = () => {
    setEdit(true);
  };

  const saveProfile = async () => {
    try {
      const updatedProfile= {
        email:user.email,
        name:nameRef.current.value,
        lastName:lastNameRef.current.value,
        poste:postRef.current.value,
        phone:phoneRef.current.value,
        image:profileImage
      }
      await updateUserProfile(updatedProfile)
      toast.success('profile updated successfully', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });

      setEdit(false);

    } catch (error) {
      toast.error(error.data?.message, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    }
  };
//password change

  const handleChangePassword = () => {

    setChangePassword(true);
  };


  return (
    <Card className={classes.sizeInfoCard}>

        <UploadImage userImage={profile.image} previewImage={profileImage}  handleImage={setProfileImage} />


      <CardContent>
        <Grid
          container
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={6} sm={6} md={4} lg={4}>
            <h1 className={classes.pageTitle}>My profile</h1>
          </Grid>

          <Grid item xs={6} sm={6} md={8} lg={8}>
            <span className={classes.creationDate}>
              <br />
              created on {formatDate(user.createdAt)}
            </span>
          </Grid>
          <Grid item xs={12} lg={12}>
            <span className={classes.labels}>
              {!edit ? "Full name" : "First Name and LastName"}
            </span>
            <br />
            {!edit ? (
              <h2 className={classes.profileInfo}>
                {`${profile.name} ${profile.lastName}`}
              </h2>
            ) : (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TextField
                      className={classes.input}
                      inputRef={nameRef}
                      variant="outlined"
                      size="small"
                      name="name"
                      defaultValue={profile.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TextField
                      className={classes.input}
                      inputRef={lastNameRef}
                      variant="outlined"
                      size="small"
                      name="lastName"
                      defaultValue={profile.lastName}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
          <Grid item xs={12} lg={12}>
            <span className={classes.labels}>Email</span>
            <br />
            <h2 className={classes.profileInfo}>{user.email}</h2>
          </Grid>
          <Grid item xs={12} lg={12}>
            <span className={classes.labels}>Password</span>
            <br />
            {!changePassword ? (
              <h2 className={classes.profileInfo}>
                ******************************
              </h2>
            ) : (
              <>
                <TextField
                  className={classes.input}
                  inputRef={passwordRef}
                  variant="outlined"
                  size="small"
                  name="password"
                />
                <TextField
                  className={classes.input}
                  inputRef={confirmPasswordRef}
                  variant="outlined"
                  size="small"
                  name="confirmPassword"
                />
              </>
            )}
          </Grid>
          <Grid item xs={12} lg={12}>
            <span className={classes.labels}>Poste</span>
            <br />
            {!edit ? (
              <h2 className={classes.profileInfo}>{profile.poste}</h2>
            ) : (
              <TextField
                className={classes.input}
                inputRef={postRef}
                variant="outlined"
                size="small"
                name="poste"
                defaultValue={profile.poste}
              />
            )}
          </Grid>
          <Grid item xs={12} lg={12}>
            <span className={classes.labels}>Phone</span>
            <br />
            {!edit ? (
              <h2 className={classes.profileInfo}>{profile.phone}</h2>
            ) : (
              <TextField
                className={classes.input}
                inputRef={phoneRef}
                variant="outlined"
                size="small"
                name="phone"
                defaultValue={profile.phone}
              />
            )}
          </Grid>
          <Grid item xs={12} lg={12}>
            <button
              onClick={!edit ? handleEdit : saveProfile}
              className={classes.updateProfile}
            >
              {!edit ? "Update My profile" : "Save My profile"}{" "}
            </button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SideInfo;
