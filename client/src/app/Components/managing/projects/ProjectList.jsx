import React from "react";
import { projectsStyles } from "../style";
// import { projectTestList } from "./test/projectList.test";
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
      label: "Gérant",
      attribute: "manager",
      width: 200
    },
    {
      label: "Nom du projet",
      attribute: "projectName",
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


  return (
    <div className={classes.listContainer}>
      <div className={classes.headers}>
        {columns.map((column, counter) => (
          <div
            key={counter}
            className={classes.column}
            style={{ width: column.width }}
          >
            <p className={classes.columnTitle}>{column.label}</p>
          </div>
        ))}
      </div>
      <div className={classes.content}>
        {projects.map((project,id) => (
          <div key={id} className={classes.rowData}>
            {columns.map(({ attribute }, key) => (
              <div
                key={key}
                className={classes.dataList}
                style={{ minWidth: `calc((100% / ${columns.length}) - 180px )` }}
              >

                  {project[attribute].constructor == Object ? (
                    Object.keys(project[attribute]).map((item, idx) =>
                      item === "image" ? (
                        project[attribute][item]?
                        <img  key={idx} className={classes.avatar} src={`${process.env.REACT_APP_SERVER_URL}${project[attribute][item]}`} alt={`manager avatar ${idx}`} />
                        :
                        <span className={`${classes.avatar} ${getRandomColor()}`}>
                          {project[attribute].fullName[0]}{project[attribute].fullName.split(' ')[1][0]}
                        </span>
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
