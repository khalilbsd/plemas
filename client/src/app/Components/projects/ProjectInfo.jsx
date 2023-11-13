import {
  Chip,
  Grid,
  MenuItem,
  Select,
  Skeleton,
  TextField
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ReactSVG } from "react-svg";
import { NOTIFY_ERROR, NOTIFY_INFO, NOTIFY_SUCCESS } from "../../../constants/constants";
import { SUPERUSER_ROLE } from "../../../constants/roles";
import useGetAuthenticatedUser from "../../../hooks/authenticated";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import {
  useAssignManagerHoursMutation,
  useGetLotsMutation,
  useGetPhasesMutation,
  useGetPotentielManagersMutation,
  useUpdateProjectMutation
} from "../../../store/api/projects.api";
import {
  setLot,
  setPhases,
  setPotentielManagers
} from "../../../store/reducers/manage.reducer";
import faSave from "../../public/svgs/light/floppy-disk.svg";
import faEdit from "../../public/svgs/light/pen.svg";
import faCancel from "../../public/svgs/light/xmark.svg";
import SelectLot from "../managing/projects/SelectLot";
import { notify } from "../notification/notification";
import { projectDetails } from "./style";

import useIsUserCanAccess from "../../../hooks/access";
import { setEditProject } from "../../../store/reducers/project.reducer";
import { formattedDate } from "../../../store/utils";
import { projectsStyles } from "../managing/style";
import ProjectIntervenant from "./ProjectIntervenant";
import ProjectUserLists from "./ProjectUserLists";
import HoursPopUp from "./HoursPopUp";

const initialState = {
  code: "",
  name: "",
  phase: "",
  lots: [],
  // project state will be here
  startDate: "",
  dueDate: "",
  manager: "",
  priority: ""
};

const ProjectInfo = ({ loading, open }) => {
  const project = useGetStateFromStore("project", "projectDetails");
  const editData = useGetStateFromStore("manage", "addProject");

  const { user, isAuthenticated } = useGetAuthenticatedUser();
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const [edit, setEdit] = useState(false);
  const [managerPopUP, setManagerPopUP] = useState({ open: false, hours: 0 });
  const classes = projectDetails();
  const externalProjectClasses = projectsStyles();
  const [getLots] = useGetLotsMutation();
  const [getPhases] = useGetPhasesMutation();
  const [getPotentielManagers] = useGetPotentielManagersMutation();
  const dispatch = useDispatch();
  const [editedProject, setEditedProject] = useState(initialState);
  const [updateProject] = useUpdateProjectMutation();
  const [assignManagerHours,{isLoading:loadMangerHours}] = useAssignManagerHoursMutation();

  useEffect(() => {
    async function loadPhasesAndLots() {
      try {
        const phasesData = await getPhases().unwrap();
        const lotsData = await getLots().unwrap();
        const data = await getPotentielManagers().unwrap();
        dispatch(setPhases(phasesData?.phases));
        dispatch(setLot(lotsData?.lots));
        dispatch(setPotentielManagers(data.users));
      } catch (e) {
        notify(NOTIFY_ERROR, e?.data?.message);
      }
    }
    if (
      isAuthenticated &&
      (user?.role === SUPERUSER_ROLE ||
        user?.email === project?.managerDetails?.email)
    ) {
      loadPhasesAndLots();
      setEditedProject({
        code: project.code,
        name: project.name,
        phase: project?.phase?.name,
        lots: getProjectsLots(),
        startDate: dayjs(project.startDate),
        dueDate: project.dueDate,
        manager: project.manager,
        priority: project.priority
      });
    }
  }, [edit, project]);

  const handleEdit = () => {
    setEdit((prevState) => !prevState);
  };

  useEffect(() => {
    dispatch(setEditProject(edit));
  }, [edit]);

  const handleUpdate = async () => {
    try {
      const data = { ...editedProject };
      if (data.phase === project.phase.name) {
        delete data.phase;
        if (data.code === project.code) delete data.code;
      }
      data.startDate = dayjs(data.startDate).format("DD/MM/YYYY");
      // }

      const res = await updateProject({
        body: data,
        projectID: project.id
      }).unwrap();
      notify(NOTIFY_SUCCESS, res?.message);
      setEdit(false);
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data.message);
    }
  };

  const getProjectsLots = () => {
    let list = [];
    project?.projectLots?.forEach(({ lot }) => {
      list.push(lot.name);
    });
    return list;
  };

  const handleChange = (e) => {
    setEditedProject({ ...editedProject, [e.target.name]: e.target.value });
  };

  const handleLotChange = (event) => {
    const {
      target: { value }
    } = event;
    setEditedProject({
      ...editedProject,
      lots: typeof value === "string" ? value.split(",") : value
    });
  };

  const handleManagerHoursPopUP = () => {
    setManagerPopUP((prevState) => {
      return { ...managerPopUP, open: !prevState.open };
    });
  };

  const handleManagerHours = (e) => {
    // if (e.target.value < project.manager){
    //   notify(NOTIFY_INFO,"vous")
    //   return
    // }
    setManagerPopUP({ ...managerPopUP, hours: e.target.value });
    return
  };

  const handleSubmitManagerHours = async () => {
    try {
      if (managerPopUP.hours === 0){

        notify(NOTIFY_INFO,"rien ne changera le nombre d'heures restera le même")
        return
      }
        let obj={}
        if (isSuperUser) {
          obj.user=project.manager
        }
        obj.hours = managerPopUP.hours;
        const res = await assignManagerHours({body:obj,projectID:project.id}).unwrap();
        console.log(res)
        notify(NOTIFY_SUCCESS,res?.message)
        handleManagerHoursPopUP()
    } catch (error) {

      if (error.status === 400){
        notify(NOTIFY_INFO,error?.data?.message);
        return
      }
      notify(NOTIFY_ERROR,error?.data?.message);

    }
  };

  if (loading || !project)
    return <Skeleton className={classes.mainInfoSkeleton} />;

  return (
    <div className={`${classes.mainInfo} ${open ? "collapsed" : "hidden"}`}>
      <HoursPopUp
        open={managerPopUP.open}
        close={handleManagerHoursPopUP}
        title="Renseigner votre heurs"
        text="Vous pouvez renseigner votre heurs ici"
        handleChange={handleManagerHours}
        defaultVal={project.managerHours || managerPopUP.hours}
        minValue={project.managerHours || managerPopUP.hours}
        submit={handleSubmitManagerHours}
        btnText="Confirmer"
        loading={loadMangerHours}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h3 className={classes.sectionTitle}>Information générale</h3>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={8}>
          <div className={`${classes.card} internal`}>
            <Grid container spacing={2}>
              {/* project code  */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">Code </p>
                  {!edit ? (
                    <div className="value">{project.code}</div>
                  ) : (
                    <TextField
                      onChange={handleChange}
                      type="text"
                      defaultValue={project.code}
                      size="small"
                      name="code"
                    />
                  )}
                </div>
              </Grid>
              {/* project name */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">Nom du projet </p>
                  {!edit ? (
                    <div className="value">{project.name}</div>
                  ) : (
                    <TextField
                      type="text"
                      defaultValue={project.name}
                      size="small"
                      name="name"
                      onChange={handleChange}
                    />
                  )}
                </div>
              </Grid>
              {/* project phase */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">la Phase</p>
                  {!edit ? (
                    <div className="value">{project.phase?.name}</div>
                  ) : !editData.phases.length ? (
                    <Skeleton variant="rectangular" width={150} height={50} />
                  ) : (
                    <Select
                      name="phase"
                      labelId="phase-select-label"
                      id="phase"
                      onChange={handleChange}
                      value={editData?.phases ? editedProject.phase : ""}
                      size="small"
                    >
                      {editData?.phases.map((phase, phaseIdx) => (
                        <MenuItem key={phaseIdx} value={phase.name}>
                          {phase.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </div>
              </Grid>

              {/* projects lot  */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">les Lots</p>
                  {!edit ? (
                    <div className="value">
                      {project.projectLots?.map(({ lot }) => (
                        <Chip key={lot.name} label={lot?.name} size="medium" />
                      ))}
                    </div>
                  ) : (
                    <SelectLot
                      lots={editData.lots}
                      initialValue={editedProject.lots}
                      size="small"
                      handleChange={handleLotChange}
                    />
                  )}
                </div>
              </Grid>

              {/* project state  */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">l'Etat du projet</p>
                  <div className="value">not implemented</div>
                </div>
              </Grid>

              {/* date debut */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">Date début </p>
                  {!edit ? (
                    <div className="value">
                      {project.startDate
                        ? formattedDate(project.startDate)
                        : "------------"}
                    </div>
                  ) : (
                    editedProject.startDate && (
                      <LocalizationProvider
                        size="small"
                        dateAdapter={AdapterDayjs}
                        adapterLocale="en-gb"
                      >
                        <DatePicker
                          size="small"
                          defaultValue={editedProject.startDate}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setEditedProject({
                              ...editedProject,
                              startDate: newValue
                            })
                          }
                        />
                      </LocalizationProvider>
                    )
                  )}
                </div>
              </Grid>
              {/* date fin */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <div className={classes.data}>
                  <p className="label">Date Fin</p>
                  <div className="value">
                    {project.dueDate ? (
                      project.dueDate
                    ) : (
                      <span className="outline warning">
                        le project est cours
                      </span>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4}>
          <div className={`${classes.card} internal`}>
            <Grid container spacing={2}>
              {/* creator */}
              {/* <Grid item xs={12}>
              <div className={classes.data}>
                <p className="label">Initial créateur projet</p>
                <div className="value">
                  <div className={classes.manager}>
                    {project.creatorDetails?.UserProfile?.image ? (
                      <img
                        src={`${process.env.REACT_APP_SERVER_URL}${project.creatorDetails?.UserProfile?.image}`}
                      />
                    ) : (
                      <span className="initials">
                        {project.creatorDetails?.UserProfile?.name[0]}
                        {project.creatorDetails?.UserProfile?.lastName[0]}
                      </span>
                    )}
                    <p className="manager-name">
                      {project.creatorDetails?.UserProfile?.name}
                      {project.creatorDetails?.UserProfile?.lastName}
                      <br />
                      <span className="email">
                        {project.creatorDetails?.email}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Grid> */}

              {/* manager */}
              <Grid item xs={12}>
                <div className={classes.data}>
                  {!edit ? (
                    <div className="value">
                      <div className={classes.manager}>
                        {project.managerDetails?.UserProfile?.image ? (
                          <img
                            src={`${process.env.REACT_APP_SERVER_URL}${project.managerDetails?.UserProfile?.image}`}
                            alt={`avatar for user ${project.managerDetails?.UserProfile?.name}`}
                          />
                        ) : (
                          <span className="initials">
                            {project.managerDetails?.UserProfile?.name[0]}
                            {project.managerDetails?.UserProfile?.lastName[0]}
                          </span>
                        )}
                        <p className="manager-name">
                          {project.managerDetails?.UserProfile?.name}
                          {project.managerDetails?.UserProfile?.lastName}
                          <br />
                          <span className="email">
                            {project.managerDetails?.email}
                          </span>
                        </p>
                      </div>

                      <button
                        className="position"
                        onClick={handleManagerHoursPopUP}
                      >
                        <span className="init">Chef de projet</span>
                        <span className="changed">renseigner heurs</span>
                      </button>
                    </div>
                  ) : !editData.managers.length ? (
                    <Skeleton variant="rectangular" width={210} height={50} />
                  ) : (
                    <ProjectUserLists
                      handleChange={handleChange}
                      userValue={editedProject.manager}
                      list={editData.managers}
                      externalClass={externalProjectClasses}
                    />
                  )}
                </div>
              </Grid>
              <Grid item xs={12}>
                {/* listee des intervenant  */}
                <Grid item xs={12}>
                  <div className={classes.data}>
                    <p className="label">
                      Total des heures des intervenant:{" "}
                      {project.projectNbHours ? project.projectNbHours : 0}h{" "}
                    </p>
                  </div>

                  <ProjectIntervenant />
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      {(isSuperUser ||
        (isManager && user?.email === project?.managerDetails?.email)) && (
        <div className={classes.actions}>
          {edit && (
            <button onClick={handleEdit} className="cancel">
              <ReactSVG src={faCancel} />
              <span className="text">Annuler</span>
            </button>
          )}
          <button onClick={!edit ? handleEdit : handleUpdate}>
            <ReactSVG src={!edit ? faEdit : faSave} />
            <span className="text">{!edit ? "Éditer" : "Enregistrer"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectInfo;
