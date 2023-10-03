import { CardMedia } from "@mui/material";
import { useRef, useState } from "react";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants";
import { useUpdateUserProfilePictureMutation } from "../../../store/api/users.api";
import Loading from "../loading/Loading";
import { notify } from "../notification/notification";
import { styles } from "./style";

const UploadImage = ({ email, userImage, previewImage, handleImage }) => {
  const fileInputRef = useRef(null);
  const classes = styles();
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [updateUserProfilePicture, { isLoading }] =
    useUpdateUserProfilePictureMutation();

  const handleButtonClick = () => {
    // Use current property of the ref to access the input element
    fileInputRef.current.click();
  };

  const onChange = async (e) => {
    setLoading(true);
    const files = e.target.files;
    const file = files[0];
    await getBase64(file);
    setLoading(false);
  };

  const getBase64 = async (file) => {
    if (file) {
      let reader = await new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        onLoad(reader.result);
      };
    }
  };
  const onLoad = (fileString) => {
    handleImage(fileString);

    // handleSubmit()
  };
  console.log(isLoading);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("profileImage", fileInputRef.current.files[0]);
      formData.append("email", email);

      await updateUserProfilePicture(formData).unwrap();
      notify(NOTIFY_SUCCESS, "profile picture updated successfully");
    } catch (error) {
      notify(NOTIFY_ERROR, error.data?.message);
    }
  };

  return (
    <div>
      <form
        className={classes.uploaderForm}
        ref={formRef}
        onSubmit={handleSubmit}
        method="PATCH"
        encType="multipart/form-data"
      >
        <div
          onClick={handleButtonClick}
          className={!userImage && !previewImage ? classes.uploadContainer : ""}
        >
          {!userImage && !previewImage && (
            <p className={classes.btnFileInput}>Select File</p>
          )}
        </div>
        <div className={classes.imageContainer}>
          {(userImage || previewImage) && (
            <CardMedia
              sx={{ height: 400 }}
              image={previewImage ? previewImage : `${process.env.REACT_APP_SERVER_URL}${userImage}`}
              className={
                classes.profileImage + " " + (isLoading ? classes.blur : "")
              }
              title="profile Picture"
            />
          )}
          {isLoading && (
            <div className={classes.loader}>
              <Loading />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          style={{ display: "none" }}
          type="file"
          onChange={onChange}
          name="profileImage"
        />
        <div className={classes.ctaBtn}>
          {previewImage && (
            <button className="br" type="submit">
              Save image
            </button>
          )}
          {!userImage && previewImage && (
            <button type="button" onClick={handleButtonClick}>
              Update image
            </button>
          )}

          {userImage && (
            <button type="button" onClick={handleButtonClick}>
              Update image
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UploadImage;
