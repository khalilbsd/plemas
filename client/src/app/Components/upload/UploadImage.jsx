import { CardMedia } from "@mui/material";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useUpdateUserProfilePictureMutation } from "../../../store/api/users.api";
import Loading from "../loading/Loading";
import { styles } from "./style";

const UploadImage = ({ email, userImage, previewImage, handleImage }) => {
  const fileInputRef = useRef(null);
  const classes = styles();
  const formRef = useRef();
  const [loading, setLoading] = useState(false)
  const [updateUserProfilePicture, { isLoading }] =
    useUpdateUserProfilePictureMutation();
  const handleButtonClick = () => {
    // Use current property of the ref to access the input element
    fileInputRef.current.click();
  };



  const onChange = async(e) => {
    setLoading(true)
    const files = e.target.files;
    const file = files[0];
    await getBase64(file);
    setLoading(false)
  };

  const getBase64 = async(file) => {
    if (file){
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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("profileImage", fileInputRef.current.files[0]);
      formData.append("email", email);

      await updateUserProfilePicture(formData);
      console.log("submitting image");
      toast.success('profile picture updated successfully', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
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

  return (
    <div >

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
            image={previewImage ? previewImage : userImage}
            className={classes.profileImage+" "+(loading?classes.blur:"")}
            title="profile Picture"
          />
          )}
          {loading&&<div className={classes.loader}><Loading/></div>}
          </div>
        <input
          ref={fileInputRef}
          style={{ display: "none" }}
          type="file"
          onChange={onChange}
          name="profileImage"
        />
        <div className={classes.ctaBtn}>
        {previewImage && <button className="br" type="submit">Save image</button>}
        {userImage && <button type="button" onClick={handleButtonClick}>Update image</button>}
        </div>
      </form>
    </div>
  );
};

export default UploadImage;
