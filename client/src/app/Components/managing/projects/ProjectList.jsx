import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import { setLinkedProject } from "../../../../store/reducers/manage.reducer";
import { projectsStyles } from "../style";
// import { projectTestList } from "./test/projectList.test";
import useIsUserCanAccess from "../../../../hooks/access";
import faAdd from "../../../public/svgs/solid/plus.svg";
import LinkProject from "./addProject/LinkProject";

const ProjectList = ({ addForm, handleForm }) => {
  const classes = projectsStyles();
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const projects = useGetStateFromStore("manage", "projectsList");
  const colors = useGetStateFromStore("userInfo", "avatarColors");
  const addProjectState = useGetStateFromStore("manage", "addProject");
  const navigate = useNavigate();
  const [emptyMessage, setEmptyMessage] = useState("")

  const dispatch = useDispatch();

  const columns = [
    {
      label: "ID",
      attribute: "code",
      width: 200
    },
    {
      label: "Phase v",
      attribute: "activePhase",
      width: 200
    },
    {
      label: "Chef de projet",
      attribute: "manager",
      width: 200
    },
    {
      label: "Nom du projet",
      attribute: "projectCustomId",
      width: 200
    },
    {
      label: "Taches",
      attribute: "tasks",
      width: 200
    },
    {
      label: "Status",
      attribute: "phaseStatus",
      width: 200
    }
  ];
  //just for colorizing

  const handleNavigation = (e) => {
    e.stopPropagation();
    // projects/:projectID
    const location = e.currentTarget;
    const projectID = location.getAttribute("data-id");
    navigate(`/projects/${projectID}`);
    // console.log("navigating ", e.currentTarget);
  };

  const projectList = () => {
    if (addForm || addProjectState.isFiltering) {
      return addProjectState.projectsListFiltered;
    }
    return projects;
  };
  useEffect(() => {
    if (!projects.length) {
      setEmptyMessage("Vous n'intervenez dans aucun projet pour l'instant ! Veuillez patienter.")
      return
    }
    setEmptyMessage("")


  }, [projects]);

  const handleClickProject = (e) => {
    e.stopPropagation();
    const location = e.currentTarget;
    const projectID = location.getAttribute("data-id");
    dispatch(setLinkedProject(projectID));
    const elements = document.querySelectorAll(".row-data");
    elements.forEach((element) => {
      element.classList.remove("active");
    });
    location.classList.add("active");
  };

  return (
    <div
      style={addForm ? { height: "calc(100% - 188px)" } : { height: "99.5%" }}
      className={classes.listContainer}
    >
      <div className={classes.header}>
        {
          !addForm && (
            <div className={classes.addBtnContainer}>
              <LinkProject
                className={classes.search}
                color="secondary"
                label="Recherche"
                size="small"
              />
              {
                (isSuperUser || isManager) &&
              <button onClick={handleForm}>
                <ReactSVG src={faAdd} />
              </button>
              }
            </div>
          )}

        <div className={classes.headersItem}>
          {columns.map((column, counter) => (
            <div
              key={counter}
              className={classes.column}
              style={{ width: 200 }}
            >
              <p className={classes.columnTitle}>{column.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={classes.content}>
        {emptyMessage&&
          <h2 className={classes.empty}>
            {emptyMessage}
            </h2>
        }
        {projectList().map((project, id) => (
          <div
            key={id}
            onClick={
              addProjectState.isFiltering && addForm
                ? handleClickProject
                : handleNavigation
            }
            className="row-data"
            data-id={`${project.id}`}
          >
            {columns.map(({ attribute }, key) => (
              <div
                key={key}
                className={classes.dataList}
                style={{ width: 200 }}
              >
                {project[attribute].constructor == Object ? (
                  Object.keys(project[attribute]).map((item, idx) =>
                    item === "image" ? (
                      project[attribute][item] ? (
                        <img
                          key={idx}
                          className={classes.avatar}
                          src={`${process.env.REACT_APP_SERVER_URL}${project[attribute][item]}`}
                          alt={`manager avatar ${idx}`}
                        />
                      ) : (
                        <span
                          key={idx}
                          className={`${classes.avatar} ${colors[id % colors.length]}`}
                        >
                          {project[attribute].fullName[0].toUppercase()}
                          {project[attribute].fullName.split(" ")[1][0].toUppercase()}
                        </span>
                      )
                    ) : (
                      <p key={idx}>{project[attribute][item]}</p>
                    )
                  )
                ) : (
                  <p>{project[attribute]}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
