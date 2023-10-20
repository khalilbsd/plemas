import React, { useEffect, useState } from "react";
import { projectsStyles } from "../style";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import { useDispatch } from "react-redux";
import { setLinkedProject } from "../../../../store/reducers/manage.reducer";
import { useNavigate } from "react-router";
import AddBtn from "../AddBtn";
import { ReactSVG } from "react-svg";
// import { projectTestList } from "./test/projectList.test";
import faAdd from '../../../public/svgs/solid/plus.svg'
import LinkProject from "./addProject/LinkProject";
function getRandomColor() {
  const colors = [
    "light-green",
    "dark-green",
    "orange",
    "bright-orange",
    "black"
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}



const ProjectList = ({ addForm ,handleForm }) => {
  const classes = projectsStyles();
  const projects = useGetStateFromStore("manage", "projectsList");
  const addProjectState = useGetStateFromStore("manage", "addProject");
  const navigate = useNavigate()
  // console.log(projects);
  const [avatarColors, setAvatarColors] = useState([]);


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
      label: "Gérant",
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
    navigate(`/projects/${projectID}`)
    // console.log("navigating ", e.currentTarget);
  };



  const projectList = () => {
    if (addForm || addProjectState.isFiltering ) {
      return addProjectState.projectsListFiltered;
    }
    return projects;
  };
  useEffect(() => {
    const colors = projects.map(() => getRandomColor());
    setAvatarColors(colors);
  }, [projects]);

  const handleClickProject = (e) => {
    e.stopPropagation();
    const location = e.currentTarget;
    const projectID = location.getAttribute("data-id");
    dispatch(setLinkedProject(projectID));
    const elements = document.querySelectorAll('.row-data');
    elements.forEach((element) => {
      element.classList.remove('active');
    });
    location.classList.add("active");
  };

  return (
    <div
     style={addForm?{height: "calc(100% - 188px)"}:{height: "99.5%"}}
    className={classes.listContainer}>
      <div className={classes.header}>


        {!addForm&&  <div className={classes.addBtnContainer}>

          <LinkProject
          className={classes.search}
          color="secondary"
          label="Recherche"
          size="small"
          />
            <button onClick={handleForm}>
              <ReactSVG src={faAdd} />
            </button>
          </div>}


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
                        className={`${classes.avatar} ${avatarColors[id]}`}
                      >
                          {project[attribute].fullName[0]}
                          {project[attribute].fullName.split(" ")[1][0]}
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
