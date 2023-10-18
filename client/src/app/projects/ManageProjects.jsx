import { Grid, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { projectsStyles } from "../Components/managing/style";
import ProjectList from "../Components/managing/projects/ProjectList";
import { useDispatch } from "react-redux";
import {
  useCreateProjectMutation,
  useGetProjectListMutation
} from "../../store/api/projects.api";
import { notify } from "../Components/notification/notification";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../constants/constants";
import useGetStateFromStore from "../../hooks/manage/getStateFromStore";
import {
  clearAddProjectState,
  filterProjectsList,
  setProjectList
} from "../../store/reducers/manage.reducer";
import AddProject from "../Components/managing/projects/AddProject";
import { ToastContainer } from "react-toastify";
import ProjectCreationForm from "../Components/managing/projects/addProject/ProjectCreationForm";
import AddBtn from "../Components/managing/AddBtn";
import faProject from "../public/svgs/light/diagram-project.svg";
import dayjs from "dayjs";

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

  //ADD hooks
  const [createProject, { isLoading: creatingProject }] =
    useCreateProjectMutation();

  async function loadProjects() {
    try {
      const data = await getProjectList().unwrap();

      dispatch(setProjectList(data.projects));
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  }
  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAddForm = () => {
    if (addProjectForm) {
      setNewProject(newProjectInitialState)
      dispatch(filterProjectsList({ flag: false, value: "" }));
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

      // const project = newProject;
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
        <Grid item xs={12} md={4} lg={2}>
          <div className="page-title">
            <h1>Projets</h1>
          </div>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <TextField
            variant="outlined"
            name="search"
            label="Search"
            size="small"
            className={classes.searchField}
          />
        </Grid>
        {addProjectForm && (
          <Grid item xs={12} lg={12}>
            <div className={classes.addProjectForm}>
              <ProjectCreationForm
                refreshProjects={loadProjects}
                formOpen={addProjectForm}
                handleClose={handleOpenAddForm}
                codeRef={codeRef}
                errorMessage={errorMessage}
                setNewProject={setNewProject}
                newProject={newProject}
              />
            </div>
          </Grid>
        )}
        <Grid item xs={12} lg={12}>
          <ProjectList addForm={addProjectForm} />
        </Grid>
        <Grid item xs={12} lg={12}>
          {/* <AddProject refreshProjects={loadProjects}/> */}
          <div className={classes.addBtnContainer}>
            <AddBtn
              title={!addProjectForm ? "Créer un projet" : "Nouveau projet"}
              icon={faProject}
              handleAdd={
                !addProjectForm ? handleOpenAddForm : handleSubmitProject
              }
            />
          </div>
        </Grid>
      </Grid>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ManageProjects;
