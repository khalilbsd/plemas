import React, { useRef, useState } from "react";
import fileDownload from "js-file-download";

import { useParams } from "react-router";
import PopUp from "../PopUp/PopUp.jsx";
import faEmptyFolder from "../../public/svgs/light/folder-open.svg";
import faFolders from "../../public/svgs/light/folders.svg";
import faPlus from "../../public/svgs/solid/plus.svg";
import faFile from "../../public/svgs/solid/file.svg";
import { ReactSVG } from "react-svg";
import { projectTaskDetails } from "./style";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants.js";
import { notify } from "../notification/notification.js";
import { useDownloadTaskFileMutation } from "../../../store/api/tasks.api.js";
import axios from "../../../store/api/base.js";
import { useUploadFileToProjectRequestMutation } from "../../../store/api/requests.api.js";
import { useDispatch } from "react-redux";
import { updateFileRequestList } from "../../../store/reducers/project.reducer.js";
import Tooltip from "@mui/material/Tooltip";

const RequestFiles = (props) => {
  const { files, requestID, isCreator } = props;
  const { projectID } = useParams();
  const [openFolder, setOpenFolder] = useState(false);
  const fileInputRef = useRef(null);
  const classes = projectTaskDetails();
  const isDownloadingRef = useRef(false);
  const dispatch = useDispatch();
  const [uploadFileToProjectRequest] = useUploadFileToProjectRequestMutation();
  // const [downloadTaskFile] = useDownloadTaskFileMutation();

  const handleDownload = async (e, url, name) => {
    try {
      // Check if the download is already in progress
      if (isDownloadingRef.current) {
        return;
      }
      isDownloadingRef.current = true;
      const fileName = url.substr(url.indexOf("-") + 1);
      const res = await axios.get(url, {
        responseType: "blob"
      });

      fileDownload(res.data, fileName);
      isDownloadingRef.current = false;
    } catch (error) {
      console.log(error);
      isDownloadingRef.current = false;
    }
  };

  const handleOpen = () => {
    setOpenFolder(true);
  };
  const handleClose = () => {
    setOpenFolder(false);
  };

  const onChange = async (e) => {
    const files = Array.from(e.target.files);
    // const file = files[0];
    for (const file in files) {
      if (file[file]?.size > 10 * 1024 * 1024) {
        notify(NOTIFY_ERROR, "Le fichier est trop grande");
        return;
      }
    }

    if (files && files.length) {
      onLoad(files);
    }
    // setFiles(files);
  };

  const onLoad = async (files) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
      const res = await uploadFileToProjectRequest({
        projectID,
        requestID,
        body: formData
      }).unwrap();
      notify(NOTIFY_SUCCESS, res?.message);
      dispatch(updateFileRequestList({ requestID, urls: res.files }));

      handleClose();
    } catch (error) {
      console.log(error);
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const filesList = files.map((file, key) => (
    <div
      onClick={(e) =>
        handleDownload(
          e,
          `${process.env.REACT_APP_SERVER_URL}${file}`,
          file.split("-")[1]
        )
      }
      key={key}
      className={`file ${classes.fileItem}`}
    >
      <ReactSVG className={classes.fileIcon} src={faFile} />
      <Tooltip title={file.substr(file.indexOf("-") + 1)} arrow placement="top">
        <span className="file-name"> {file.substr(file.indexOf("-") + 1)}</span>
      </Tooltip>
    </div>
  ));

  const handleUpload = () => {
    // Use current property of the ref to access the input element
    fileInputRef.current.click();
  };

  return (
    <div>
      <PopUp
        open={openFolder}
        handleClose={handleClose}
        title={`Les attachements du requete ${requestID}`}
      >
        <div className={classes.filesList}>
          {files && filesList}

          {isCreator && (
            <div className={`${classes.fileItem} add`} onClick={handleUpload}>
              <ReactSVG src={faPlus} /> <span>Ajouter un fichier</span>
              <input
                ref={fileInputRef}
                style={{ display: "none" }}
                type="file"
                onChange={onChange}
                name="file"
                multiple
              />
            </div>
          )}
        </div>
      </PopUp>
      <button className={classes.taskFileBtn} onClick={handleOpen}>
        {files.length === 0 ? (
          <>
            <ReactSVG src={faEmptyFolder} /> <span>Pas de fichiers</span>
          </>
        ) : (
          <>
            <ReactSVG src={faFolders} /> <span>Voir attachements</span>
          </>
        )}
      </button>
    </div>
  );
};

export default RequestFiles;
