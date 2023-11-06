import { Grid } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../constants/constants";
import useIsUserCanAccess from "../../hooks/access";
import useGetStateFromStore from "../../hooks/manage/getStateFromStore";
import {
  useCreateProjectMutation,
  useGetProjectListMutation
} from "../../store/api/projects.api";
import {
  clearAddProjectState,
  filterProjectsList,
  setLinkedProject,
  setLinkingProject,
  setProjectList
} from "../../store/reducers/manage.reducer";
import ProjectList from "../Components/managing/projects/ProjectList";
import ProjectCreationForm from "../Components/managing/projects/addProject/ProjectCreationForm";
import { projectsStyles } from "../Components/managing/style";
import { notify } from "../Components/notification/notification";
import { setTwoWeeksDatesList } from "../../store/reducers/project.reducer";

const initialError = {
  filedName: undefined,
  error: false,
  message: ""
};
const newProjectInitialState = {
  projectType: "",
  code: {
    value: undefined,
    required: true
  },
  startDate: {
    value: dayjs(new Date()),
    required: true
  },
  name: {
    value: undefined,
    required: true
  },
  manager: {
    value: "",
    required: true
  },
  priority: {
    value: undefined,
    required: false
  },
  phase: {
    value: "",
    required: true
  },
  lot: {
    value: [],
    required: true
  }
};

const ManageProjects = () => {
  const dispatch = useDispatch();
  const [getProjectList, { isLoading }] = useGetProjectListMutation();
  const [addProjectForm, setAddProjectForm] = useState(false);
  const codeRef = useRef();
  const [errorMessage, setErrorMessage] = useState(initialError);
  const [newProject, setNewProject] = useState(newProjectInitialState);
  const projectState = useGetStateFromStore("manage", "addProject");
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const projectList = useGetStateFromStore("manage", "projectsList");

  //ADD hooks
  const [createProject, { isLoading: creatingProject }] =
    useCreateProjectMutation();

  async function loadProjects() {
    try {
      const data = await getProjectList().unwrap();

      dispatch(setProjectList({projects:data.projects,tasks:data.projectsTasks}));
      dispatch(setTwoWeeksDatesList(data.dates));

    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  }
  useEffect(() => {
    if (!projectList.length){
      loadProjects();
    }
  }, []);

  const handleOpenAddForm = () => {
    if (addProjectForm) {
      setNewProject(newProjectInitialState);
      dispatch(filterProjectsList({ flag: false, value: "" }));
      const elements = document.querySelectorAll(".row-data");
      elements.forEach((element) => {
        element.classList.remove("active");
      });
      dispatch(setLinkedProject(null));
      dispatch(setLinkingProject(null));
    } else {
      dispatch(filterProjectsList({ flag: true, value: "" }));
    }

    setAddProjectForm((prevState) => !prevState);
  };

  const classes = projectsStyles();

  //adding the project
  const handleSubmitProject = async () => {
    //check for item that are required :
    if (!codeRef.current.value) {
      setErrorMessage({
        filedName: "code",
        error: true,
        message: `code est requise!`
      });

      return;
    }

    if (!newProject.startDate.value) {
      setNewProject({
        ...newProject,
        startDate: { ...newProject.startDate, value: "undefined" }
      });
      setErrorMessage({
        filedName: "startDate",
        error: true,
        message: `date debut est requise!`
      });
      return;
    }
    for (let index = 1; index < Object.keys(newProject).length; index++) {
      if (
        Object.keys(newProject)[index] !== "code" &&
        newProject[Object.keys(newProject)[index]].required
      ) {
        if (
          !newProject[Object.keys(newProject)[index]].value ||
          (Array.isArray(newProject[Object.keys(newProject)[index]].value) &&
            !newProject[Object.keys(newProject)[index]].value.length)
        ) {
          setErrorMessage({
            filedName: Object.keys(newProject)[index],
            error: true,
            message: `${Object.keys(newProject)[index]} est requise!`
          });
          return;
        }
      }
    }

    try {
      const {
        code: { value: codeValue },
        name: { value: nameValue },
        startDate: { value: startDateValue },
        manager: { value: managerValue },
        priority: { value: priorityValue },
        phase: { value: phaseValue },
        lot: { value: lotValue }
      } = newProject;

      const project = {
        code: codeRef.current.value || projectState.code,
        name: nameValue,
        startDate: startDateValue,
        manager: managerValue,
        priority: priorityValue,
        phase: phaseValue,
        lot: lotValue,
        active: true,
        prevPhase: projectState.linkedProjectID
          ? projectState.linkedProjectID
          : null
      };

      if (projectState.customCode !== projectState.code) {
        project.isCodeCustomized = true;
      } else {
        project.isCodeCustomized = false;
      }
      const data = await createProject(project).unwrap();
      console.log(data);

      notify(NOTIFY_SUCCESS, data.message);
      handleOpenAddForm();
      dispatch(clearAddProjectState());
      loadProjects();
      setNewProject(newProjectInitialState);
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data.message);
    }
  };

  return (
    <div className={classes.projectsPage}>
      <Grid container alignItems="center" spacing={2} sx={{ height: "100%" }}>
        {(isSuperUser||isManager)&&
        addProjectForm && (
          <Grid item xs={12} lg={12}>
            <ProjectCreationForm
              handleSubmit={handleSubmitProject}
              refreshProjects={loadProjects}
              formOpen={addProjectForm}
              handleClose={handleOpenAddForm}
              codeRef={codeRef}
              errorMessage={errorMessage}
              setNewProject={setNewProject}
              newProject={newProject}
            />
          </Grid>
        )}
        <Grid item xs={12} lg={12} sx={{height:'100%'}}>
          <ProjectList
            addForm={addProjectForm}
            handleForm={handleOpenAddForm}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ManageProjects;
