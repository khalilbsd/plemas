import { Grid, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useGetUserInfo from "../../../hooks/user";
import { useUpdateUserProfileMutation } from "../../../store/api/users.api";
import { styles } from "../../profile/style";
import Loading from "../loading/Loading";
import UploadImage from "../upload/UploadImage";
import { useDispatch } from "react-redux";
import { updateUserInfoProfile } from "../../../store/reducers/user.reducer";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import { notify } from "../notification/notification";

const SideLayoutInfo = () => {
  const [profileImage, setProfileImage] = useState(null);
  const classes = styles();

  const { user, profile } = useGetUserInfo();

  const [updateUserProfile, {}] = useUpdateUserProfileMutation();

  //profile Ref attributes
  const nameRef = useRef();
  const lastNameRef = useRef();
  const postRef = useRef();
  const phoneRef = useRef();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  if (!user || !profile) return <Loading />;

  const handleEdit = () => {
    setEdit(!edit);
  };
  const saveProfile = async () => {
    try {
      const updatedProfile = {
        email: user.email,
        name: nameRef.current.value,
        lastName: lastNameRef.current.value,
        poste: postRef.current.value,
        phone: phoneRef.current.value
      };
      await updateUserProfile(updatedProfile);
      //check if image exists

      dispatch(updateUserInfoProfile(updatedProfile));
      notify(NOTIFY_SUCCESS, "profile updated successfully");
      setEdit(false);
    } catch (error) {
      console.log(error);
      notify(NOTIFY_ERROR, error.data?.message);
    }
  };

  return (
    <>
      <div className={classes.bgTop}>
        <UploadImage
          email={user?.email}
          userImage={profile?.image}
          previewImage={profileImage}
          handleImage={setProfileImage}
        />
      </div>

      <div className={classes.bottomSide}>
        <div className={classes.profileInformation}>
          <Grid
            container
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid className={classes.formItem} item xs={12} lg={12}>
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
              <span className={classes.labels}>
                {!edit ? "Full name" : "First Name and LastName"}
              </span>
            </Grid>
            <Grid className={classes.formItem} item xs={12} lg={12}>
              <h2 className={classes.profileInfo}>{user.email}</h2>
              <span className={classes.labels}>Email</span>
            </Grid>
            <Grid className={classes.formItem} item xs={12} lg={12}>
              <Grid container alignItems="center">
                <Grid item xs={8} sm={8} lg={8}>
                  <h2 className={classes.profileInfo}>*******************</h2>
                  <span className={classes.labels}>Password</span>
                </Grid>
                <Grid sx={{ textAlign: "right" }} item xs={4} sm={4} lg={4}>
                  <Link
                    className={classes.changePasswordBtn}
                    to="/settings/account/change-password"
                  >
                    Change
                  </Link>
                </Grid>
              </Grid>
            </Grid>
            <Grid className={classes.formItem} item xs={12} lg={12}>
              {!edit ? (
                <h2 className={classes.profileInfo}>
                  {profile.poste ? profile.poste : "Please enter your poste"}
                </h2>
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
              <span className={classes.labels}>Poste</span>
            </Grid>

            <Grid className={classes.formItem} item xs={12} lg={12}>
              {!edit ? (
                <h2 className={classes.profileInfo}>
                  {profile.phone
                    ? profile.phone
                    : "Please enter your phone number"}
                </h2>
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
              <span className={classes.labels}>Phone</span>
            </Grid>
            <Grid
              className={classes.formItem}
              item
              xs={12}
              sm={12}
              md={edit ? 6 : 12}
              lg={edit ? 6 : 12}
            >
              <button
                onClick={!edit ? handleEdit : saveProfile}
                className={classes.updateProfile}
              >
                {!edit ? "Update My profile" : "Save My profile"}{" "}
              </button>
            </Grid>
            {edit && (
              <Grid
                className={classes.formItem}
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
              >
                <button
                  type="button"
                  onClick={handleEdit}
                  className={classes.updateProfile}
                >
                  Cancel
                </button>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </>
  );
};

export default SideLayoutInfo;
