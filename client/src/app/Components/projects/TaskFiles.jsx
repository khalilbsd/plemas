import Tooltip from "@mui/material/Tooltip";
import fileDownload from "js-file-download";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { ReactSVG } from "react-svg";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../constants/constants.js";
import axios from "../../../store/api/base.js";
import { useUploadFileToTaskMutation } from "../../../store/api/tasks.api.js";
import { updateInterventionUploadedFile } from "../../../store/reducers/task.reducer.js";
import faEmptyFolder from "../../public/svgs/light/folder-open.svg";
import faFolders from "../../public/svgs/light/folders.svg";
import faFile from "../../public/svgs/solid/file.svg";
import faPlus from "../../public/svgs/solid/plus.svg";

import PopUp from "../PopUp/PopUp.jsx";

import { notify } from "../notification/notification.js";
import { projectTaskDetails } from "./style.js";
import useGetAuthenticatedUser from "../../../hooks/authenticated.js";
import useIsUserCanAccess from "../../../hooks/access.js";

const TaskFiles = ({
  interventions,
  taskID,
  intervenantList,
  isProjectManager
}) => {
  const [openFolder, setOpenFolder] = useState(false);
  const isDownloadingRef = useRef(false);
  const { user } = useGetAuthenticatedUser();
  const { isSuperUser, isManager } = useIsUserCanAccess();

  const { projectID } = useParams();
  const classes = projectTaskDetails();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [uploadFileToTask] = useUploadFileToTaskMutation();
  // const [downloadTaskFile] = useDownloadTaskFileMutation();
  const handleOpen = () => {
    setOpenFolder(true);
  };
  const handleClose = () => {
    setOpenFolder(false);
  };
  const attachedFiles = interventions.filter((item) => item.file !== null);

  const handleDownload = async (e, url, name) => {
    try {
      // Check if the download is already in progress

      if (isDownloadingRef.current) {
        return;
      }
      // Set the download in progress
      isDownloadingRef.current = true;

      // const fileName = `${name}.${url.split(".")[2]}`;
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

  const handleUpload = () => {
    // Use current property of the ref to access the input element
    fileInputRef.current.click();
  };

  const onChange = async (e) => {
    const files = e.target.files;
    const file = files[0];

    if (file?.size > 10 * 1024 * 1024) {
      notify(NOTIFY_ERROR, "Le fichier est trop grande");
      return;
    }

    if (file) {
      onLoad(file);
    }
    // setHideBtn(false)
  };

  const onLoad = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadFileToTask({
        projectID,
        taskID,
        body: formData
      }).unwrap();
      dispatch(
        updateInterventionUploadedFile({
          taskID,
          attribute: "file",
          value: res.file,
          intervenantID: res.interventionID
        })
      );
      notify(NOTIFY_SUCCESS, res?.message);
      handleClose();
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  const filesList = attachedFiles.map((item, idx) => {
    const elements = [];
    const files = item.file ? JSON.parse(item.file) : [];
    files.forEach((file, key) => {
      elements.push(
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
          <Tooltip
            title={file.substr(file.indexOf("-") + 1)}
            arrow
            placement="top"
          >
            <span className="file-name">
              {" "}
              {file.substr(file.indexOf("-") + 1)}
            </span>
          </Tooltip>

          {/* <Link to={`${process.env.REACT_APP_SERVER_URL}${item.file}`}  rel="noopener noreferrer"target="_blank"   download="Example-PDF-document"> */}
          {/* <span> {file.split('-')[1]}</span> */}
          {/* </Link> */}
        </div>
      );
    });

    return elements;
  });

  return (
    <div className="project-details-page-task-file-list">
      <PopUp open={openFolder} handleClose={handleClose} title={`Documents`}>
        <div className={classes.filesList}>
          {filesList}
          {(isSuperUser ||
            ( isProjectManager && isManager) ||
            intervenantList.includes(user?.email)) && (
            <div className={`${classes.fileItem} add`} onClick={handleUpload}>
              <ReactSVG src={faPlus} /> <span>Ajouter un fichier</span>
              <input
                ref={fileInputRef}
                style={{ display: "none" }}
                type="file"
                onChange={onChange}
                name="file"
              />
            </div>
          )}
        </div>
      </PopUp>
      <button className={classes.taskFileBtn} onClick={handleOpen}>
        {attachedFiles.length === 0 ? (
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

export default TaskFiles;
