import React from "react";
import { logStyle, projectDetails } from "./style";
import Loading from "../loading/Loading";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import { ReactSVG } from "react-svg";
import faClose from '../../public/svgs/light/xmark.svg'
const ProjectLog = ({ open, closeLogTab, loadingLog }) => {
  const classes = logStyle();
  const generalStyle = projectDetails();
    const log = useGetStateFromStore("project","projectLog")



  return (
    <div className={`${classes.logTab} ${open ? "open" : ""} `}>
      {loadingLog ? <Loading color="var(--orange)" /> :

      <div className={classes.logContainer}>
      <div className="header">
      <button onClick={closeLogTab}>
            <ReactSVG src={faClose} />
        </button>
        <h2 className={generalStyle.sectionTitle}>historique du projet</h2>
      </div>
       {log? <div className={classes.logList}>
        {log?.map((line,idx)=>(
            <div key={idx} className={classes.logLine} >
              <p className="text">{line.text}</p>
              <p className="date">le {line.date}</p>
            </div>
        ))}

        </div>
       :
       <p>Nous sommes désolés de ne pas avoir pu récupérer l'historique  ce projet.</p>
      }
    </div>}

    </div>
  );
};

export default ProjectLog;
