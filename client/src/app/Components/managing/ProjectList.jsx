import React from "react";
import { projectsStyles } from "./style";
import { projectTestList } from "./test/projectList.test";

const ProjectList = () => {
  const classes = projectsStyles();



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
        {projectTestList.map((project) => (
          <div className={classes.rowData}>
            {columns.map(({ attribute, width }, key) => (
              <div key={key} className={classes.data} style={{width:`calc((100% / ${columns.length}) - 120px )`}}>
                <p>{project[attribute]}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
