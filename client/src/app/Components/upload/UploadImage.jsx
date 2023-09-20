import { useRef } from "react";
import { styles } from "./style";
import { CardMedia } from "@mui/material";

const UploadImage = ({ userImage, previewImage, handleImage }) => {
  const fileInputRef = useRef(null);
  const classes = styles();
  const formRef = useRef();

  const handleButtonClick = () => {
    // Use current property of the ref to access the input element
    fileInputRef.current.click();
  };

  const onChange = (e) => {
    const files = e.target.files;
    const file = files[0];
    getBase64(file);
  };

  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onLoad(reader.result);
    };
  };
  const onLoad = (fileString) => {
    handleImage(fileString);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("submitting image");
  };

  return (
    <form
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
      {(userImage ||
        previewImage) && (
          <CardMedia
            sx={{ height: 400 }}
            image={!userImage ? previewImage : userImage}
            className={classes.profileImage}
            title="profile Picture"
          />
        )}
      <input
        ref={fileInputRef}
        style={{ display: "none" }}
        type="file"
        onChange={onChange}
        name="profileImage"
      />


    </form>
  );
};

export default UploadImage;
