import {
  Chip,
  FormHelperText,
  Grid,
  Modal,
  TextField,
  Typography
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Box } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ReactSVG } from "react-svg";
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from "../../../../constants/constants";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import {
  useCreateProjectMutation,
  useGenerateProjectCodeMutation,
  useGetLotsMutation,
  useGetPhasesMutation,
  useGetPotentielManagersMutation,
  useVerifyProjectCodeMutation
} from "../../../../store/api/projects.api";
import {
  clearAddProjectState,
  setAddProjectCode,
  setAddProjectCodeOriginal,
  setLot,
  setPhases,
  setPotentielManagers
} from "../../../../store/reducers/manage.reducer";
import faProject from "../../../public/svgs/light/diagram-project.svg";
import faClose from "../../../public/svgs/light/xmark.svg";
import Loading from "../../loading/Loading";
import { notify } from "../../notification/notification";
import AddBtn from "../AddBtn";
import { addUserFormStyles, projectsStyles } from "../style";
import SelectLot from "./SelectLot";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 5,
  boxShadow: 24,
  minHeight: 290,
  p: 4,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
};
const largeStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 5,
  boxShadow: 24,
  minHeight: 290,
  p: 4,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
};

const newProjectInitialState = {
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

const initialError = {
  filedName: undefined,
  error: false,
  message: ""
};

const AddProject = ({refreshProjects}) => {
  const classes = projectsStyles();
  const projectToAdd = useGetStateFromStore("manage", "addProject");
  const [addForm, setAddForm] = useState(false);
  const [verification, setVerification] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const externalClasses = addUserFormStyles();
  const codeRef = useRef();
  const dispatch = useDispatch();
  const [generateProjectCode, { isLoading }] = useGenerateProjectCodeMutation();
  const [verifyProjectCode, { isLoading: codeVerification }] =
    useVerifyProjectCodeMutation();
  const [getPhases, {}] = useGetPhasesMutation();
  const [getLots, { isLoading: loadingLots }] = useGetLotsMutation();
  const [errorMessage, setErrorMessage] = useState(initialError);
  const [newProject, setNewProject] = useState(newProjectInitialState);
  const [getPotentielManagers, {}] = useGetPotentielManagersMutation();
  //ADD hooks
  const [createProject, { isLoading: creatingProject }] =
    useCreateProjectMutation();
  // manage the modal open/close

  const handleOpenAddForm = () => {
    setAddForm(true);
  };
  const handleCloseAddForm = () => {
    setAddForm(false);
    dispatch(clearAddProjectState());
    setStepIdx(0);
    setNewProject(newProjectInitialState);
    setErrorMessage(initialError);
  };
  //load the the necessary  data from the apis
  useEffect(() => {
    async function loadProjectCodeSuggestion() {
      try {
        const data = await generateProjectCode().unwrap();
        dispatch(setAddProjectCode(data?.validCode));
        dispatch(setAddProjectCodeOriginal(data?.validCode));
      } catch (e) {
        notify(NOTIFY_ERROR, e?.data?.message);
      }
    }

    async function loadPhasesAndLots() {
      try {
        const phasesData = await getPhases().unwrap();
        const lotsData = await getLots().unwrap();
        dispatch(setPhases(phasesData?.phases));
        dispatch(setLot(lotsData?.lots));
      } catch (e) {
        setAddForm(false);
        notify(NOTIFY_ERROR, e?.data?.message);
      }
    }

    async function loadPotentielManagers() {
      try {
        const data = await getPotentielManagers().unwrap();
        dispatch(setPotentielManagers(data.users));
      } catch (e) {
        notify(NOTIFY_ERROR, e?.data?.message);
      }
    }

    if (addForm) {
      loadProjectCodeSuggestion();
      loadPhasesAndLots();
      loadPotentielManagers();
    }
  }, [addForm]);

  //manage the verification between steps and handle the change of the step

  const handleNextStep = async () => {
    switch (stepIdx) {
      case 0:
        //phase 1 check if there is code
        try {
          const data = await verifyProjectCode({
            code: !codeRef.current?.value
              ? projectToAdd.code
              : codeRef.current?.value
          }).unwrap();
          setStepIdx((stepIdx) => stepIdx + 1);
          dispatch(setAddProjectCode(parseInt(data?.code)));
        } catch (error) {
          codeRef.current.value = error?.data?.code;
          dispatch(setAddProjectCode(parseInt(error?.data?.code)));
          setErrorMessage({ error: true, message: error?.data?.message });
        }

        break;
      case 1:
        // verify if all the attributes are filled
        //the verification of the start date will be alone
        console.log(newProject.startDate.value);
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
              (Array.isArray(
                newProject[Object.keys(newProject)[index]].value
              ) &&
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
        setNewProject({
          ...newProject,
          code: { ...newProject.code, value: projectToAdd.code }
        });
        setStepIdx((stepIdx) => stepIdx + 1);
        setErrorMessage(initialError);
        setVerification(true);
        setTimeout(() => {
          setVerification(false);
        }, 2000);
        break;
      default:
        break;
    }
  };

  const getErrorMessage = (name) => {
    if (errorMessage.filedName === name) {
      return errorMessage;
    }
  };
  //go to the previous step
  const handlePrevStep = () => {
    setStepIdx((stepIdx) => stepIdx - 1);
  };

  //adding the project
  const handleAdd = async () => {
    try {
      const {
        code: { value: codeValue },
        name: { value: nameValue },
        startDate: { value: startDateValue },
        manager: { value: managerValue },
        priority: { value: priorityValue },
        phase: { value: phaseValue },
        lot: { value: lotValue },
      } = newProject;

      const project = {
        code: codeValue,
        name: nameValue,
        startDate: startDateValue,
        manager: managerValue,
        priority: priorityValue,
        phase: phaseValue,
        lot: lotValue,
      };


      // const project = newProject;
      if (projectToAdd.customCode !== projectToAdd.code) {
        project.isCodeCustomized = true;
      } else {
        project.isCodeCustomized = false;
      }
      const data = await createProject(project).unwrap();
      console.log(data);

      notify(NOTIFY_SUCCESS,data.message)
      handleCloseAddForm()
      // dispatch(updateProjectList(project))
      refreshProjects()
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data.message);
    }
  };

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

  const handleLotChange = (event) => {
    const {
      target: { value }
    } = event;

    setNewProject({
      ...newProject,
      lot: {
        ...newProject.lot,
        value: typeof value === "string" ? value.split(",") : value
      }
    });
  };
  const handleDataChange = (e) => {
    setNewProject({
      ...newProject,
      [e.target.name]: { ...newProject[e.target.name], value: e.target.value }
    });
  };

  const renderStep = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid item xs={12}>
              <p className={classes.info}>
                le code ci-dessous est destiné à être le code du projet !
                veuillez garder à l'esprit que ce code n'est qu'une suggestion
                de l'application. N'hésitez pas à adapter le code à vos besoins
                !
              </p>
              <p className={classes.textWarning}>
                <span className="warning">ATTENTION :</span>
                vous ne pourrez pas modifier ce code après la création.
              </p>
            </Grid>
            <Grid item xs={12}>
              {isLoading || !projectToAdd.code ? (
                <Loading color="var(--orange)" />
              ) : (
                <TextField
                  error={errorMessage.error}
                  inputRef={codeRef}
                  className={externalClasses.inputs}
                  label="code du  projet"
                  type="text"
                  id="code"
                  variant="outlined"
                  defaultValue={projectToAdd.code}
                  helperText={errorMessage.message}
                  required
                />
              )}
            </Grid>
          </>
        );

      case 1:
        return (
          <>
            <Grid item xs={12}>
              <p className={classes.info}>
                Dans cette étape, vous définirez les informations générales du
                projet. Certains champs ne seront pas affichés ici mais dans la
                dernière étape de la création car ils sont remplis
                automatiquement et ne peuvent pas être modifiés.
              </p>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs} error>
                <DatePicker
                  onError={() => getErrorMessage("startDate")?.error}
                  className={externalClasses.inputs}
                  label="Date début de projet"
                  // value={newProject.startDate}
                  slotProps={{
                    textField: {
                      helperText:
                        getErrorMessage("startDate")?.error &&
                        getErrorMessage("startDate")?.message
                    }
                  }}
                  defaultValue={newProject.startDate.value}
                  onChange={(newValue) =>
                    setNewProject({
                      ...newProject,
                      startDate: {
                        ...newProject.startDate,
                        value: dayjs(newValue).format("DD/MM/YYYY")
                      }
                    })
                  }
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                error={getErrorMessage("name")?.error}
                type="text"
                variant="outlined"
                name="name"
                defaultValue={newProject.name.value}
                id="name"
                label="Nom du projet"
                onChange={handleDataChange}
                required
                helperText={
                  getErrorMessage("name")?.error
                    ? getErrorMessage("name").message
                    : "le nom du projet sera conservé et utilisé pour référencer le projet et pour afficher le code du projet : code_project+abbreviation_de_phase_+nom_du_projet"
                }
                className={externalClasses.inputs}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                required
                error={getErrorMessage("manager")?.error}
              >
                <InputLabel id="manager-select-label">
                  Chef de projet
                </InputLabel>
                <Select
                  name="manager"
                  labelId="manager-select-label"
                  id="manager"
                  value={newProject.manager.value}
                  label="chef de projet"
                  required
                  onChange={handleDataChange}
                >
                  {projectToAdd.managers.map((manager, managerIdx) => (
                    <MenuItem
                      className={classes.MenuItem}
                      key={managerIdx}
                      value={manager.id}
                    >
                      <div className={classes.manager}>
                        {manager.image ? (
                          <img
                            src={`${process.env.REACT_APP_SERVER_URL}${manager.image}`}
                            className={classes.avatar}
                          />
                        ) : (
                          <span
                            className={`${classes.avatar} ${getRandomColor()}`}
                          >
                            {manager.name[0]}
                            {manager.lastName[0]}
                          </span>
                        )}
                        <div className="info">
                          <span className="name">{`${manager.name} ${manager.lastName}`}</span>
                          <span className="email">{manager.email}</span>
                          <span className="poste">{manager.poste}</span>
                        </div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
                {getErrorMessage("manager")?.error && (
                  <FormHelperText>
                    {getErrorMessage("manager")?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {/* phase selector */}
              <FormControl
                fullWidth
                required
                error={getErrorMessage("phase")?.error}
              >
                <InputLabel id="phase-select-label">Phase</InputLabel>
                <Select
                  name="phase"
                  labelId="phase-select-label"
                  id="phase"
                  value={newProject.phase.value}
                  label="Phase"
                  required
                  onChange={handleDataChange}
                >
                  {projectToAdd.phases.map((phase, phaseIdx) => (
                    <MenuItem key={phaseIdx} value={phase.name}>
                      {phase.name}
                    </MenuItem>
                  ))}
                </Select>
                {getErrorMessage("phase")?.error && (
                  <FormHelperText>
                    {getErrorMessage("phase")?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="number"
                variant="outlined"
                name="priority"
                id="priority"
                label="Priorité"
                onChange={handleDataChange}
                className={externalClasses.inputs}
              />
            </Grid>
            <Grid item xs={12}>
              {!loadingLots ? (
                <>
                  <SelectLot
                    classes={externalClasses.inputs}
                    lots={projectToAdd.lots}
                    initialValue={newProject.lot.value}
                    handleChange={handleLotChange}
                    error={getErrorMessage("lot")?.error}
                    errorText={getErrorMessage("lot")?.message}
                  />
                </>
              ) : (
                <Loading color="var(--orange)" />
              )}
            </Grid>
          </>
        );
      case 2:
        return verification ? (
          <>
            <Loading color="var(--orange)" />
            <span className={classes.verificationMessage}>
              Veuillez patienter, nous recueillons toutes les informations
            </span>
          </>
        ) : (
          <>
            <Grid item xs={12}>
              <p className={classes.info}>
                Prenez le temps de vérifier les informations relatives à votre
                projet. Gardez à l'esprit que certains de ces attributs ne sont
                pas modifiables et cruciaux pour le système, mais qu'ils seront
                affichés dans les détails du projet.
              </p>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <h2 className={classes.subTitle}>Resume</h2>

              {Object.keys(newProject).map((attribut) => (
                <div key={attribut}>
                  <h3 className={classes.data}>
                    {Array.isArray(newProject[attribut].value)
                      ? newProject[attribut].value.map((item) => (
                          <Chip className="chip" key={item} label={item} />
                        ))
                      : attribut === "startDate"
                      ? dayjs(newProject[attribut].value).format("DD/MM/YYYY")
                      : newProject[attribut].value}
                  </h3>
                  <label className={classes.labels}>{attribut}</label>
                </div>
              ))}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <h2 className={classes.subTitle}>Autre Details</h2>
              <div>
                <h3 className={classes.data}>
                  {newProject.code.value}
                  {newProject.phase.value[1]}_{newProject.name.value}
                </h3>
                <label className={classes.labels}>Nom complet du projet</label>
              </div>
              <div>
                <h3 className={`${classes.data} disabled`}>
                  elle ne sera activée que si le projet est terminé
                </h3>
                <label className={classes.labels}>Date d'échéance</label>
              </div>
              <div>
                <h3 className={`${classes.data} disabled`}>En cours</h3>
                <label className={classes.labels}>Etat du projet</label>
              </div>
            </Grid>
          </>
        );

      default:
        return <h1>step default {step}</h1>;
    }
  };

  return (
    <>
      <div className={classes.addBtnContainer}>
        <AddBtn
          title="Créer un projet"
          icon={faProject}
          handleAdd={handleOpenAddForm}
        />
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={addForm}
          onClose={handleCloseAddForm}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500
            }
          }}
        >
          <Fade in={addForm}>
            <Box sx={stepIdx !== 2 ? style : largeStyle}>
              {!codeVerification ? (
                <>
                  <div className={classes.closeModalBtn}>
                    <button onClick={handleCloseAddForm}>
                      <ReactSVG src={faClose} />
                    </button>
                  </div>
                  {!verification && (
                    <Typography
                      id="transition-modal-title"
                      className={classes.modalTitle}
                      variant="h6"
                      component="h2"
                      align="left"
                    >
                      Créer un projet
                    </Typography>
                  )}
                  <Grid container spacing={2}>
                    {renderStep(stepIdx)}

                    {!verification && (
                      <>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <button
                            onClick={
                              stepIdx > 0 ? handlePrevStep : handleCloseAddForm
                            }
                            className={externalClasses.cancelBtn}
                          >
                            {stepIdx > 0 ? "Précedent" : "Cancel"}
                          </button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <button
                            onClick={stepIdx < 2 ? handleNextStep : handleAdd}
                            className={externalClasses.saveBtn}
                          >
                            {stepIdx < 2 ? "Suivant " : "Créer"}
                          </button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </>
              ) : (
                <Loading color="var(--orange)" />
              )}
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
};

export default AddProject;
