import React from "react";
import { projectsStyles } from "./style";
// import { projectTestList } from "./test/projectList.test";
import faUserHolder from '../../public/svgs/solid/circle-user.svg'
import { ReactSVG } from "react-svg";
const ProjectList = ({ projects }) => {
  const classes = projectsStyles();
  // console.log(projects);

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
      label: "Manager",
      attribute: "manager",
      width: 200
    },
    {
      label: "Project Name",
      attribute: "projectName",
      width: 200
    },
    {
      label: "Tasks",
      attribute: "tasks",
      width: 200
    },
    {
      label: "State",
      attribute: "phaseStatus",
      width: 200
    }
  ];
  return (
    <div className={classes.listContainer}>
      <div className={classes.headers}>
        {columns.map((column, key) => (
          <div
            key={key}
            className={classes.column}
            style={{ width: column.width }}
          >
            <p className={classes.columnTitle}>{column.label}</p>
          </div>
        ))}
      </div>
      <div className={classes.content}>
        {projects.map((project) => (
          <div className={classes.rowData}>
            {columns.map(({ attribute }, key) => (
              <div
                key={key}
                className={classes.data}
                style={{ minWidth: `calc((100% / ${columns.length}) - 120px )` }}
              >

                  {project[attribute].constructor == Object ? (
                    Object.keys(project[attribute]).map((item, idx) =>
                      item === "image" ? (
                        console.log(project[attribute][item]),
                        project[attribute][item]?
                        <img className={classes.avatar} src={`${process.env.REACT_APP_SERVER_URL}${project[attribute][item]}`} alt={`manager avatar ${idx}`} />
                        :
                        <ReactSVG src={faUserHolder} className={`${classes.avatar} holder`} />
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
