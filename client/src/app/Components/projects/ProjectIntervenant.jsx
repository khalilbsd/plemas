import {
  Avatar,
  AvatarGroup,
  DialogContent,
  Skeleton,
  Typography
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import faAdd from "../../public/svgs/light/plus.svg";
import AddBtn from "../managing/AddBtn";
import { projectsStyles } from "../managing/style";
import ProjectUserLists from "./ProjectUserLists";
import { projectDetails } from "./style";
import { useParams } from "react-router";
import {
  useAddIntervenantsMutation,
  useGetPotentielIntervenantsMutation,
  useGetProjectIntervenantsMutation,
  useRemoveIntervenantFromProjectMutation
} from "../../../store/api/projects.api";
import Loading from "../loading/Loading";
import { notify } from "../notification/notification";
import {
  NOTIFY_ERROR,
  NOTIFY_INFO,
  NOTIFY_SUCCESS
} from "../../../constants/constants";
import { useDispatch } from "react-redux";
import useIsUserCanAccess from "../../../hooks/access";
import useGetAuthenticatedUser from "../../../hooks/authenticated";

function AddIntervenant(props) {
  const { onClose, open, potentialIntervenants } = props;

  const { projectID } = useParams();
  const [intervenants, setIntervenants] = useState([]);
  const [addIntervenants, { isLoading: updatingIntervenants }] =
    useAddIntervenantsMutation();
  const externalProjectClasses = projectsStyles();
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    setIntervenants(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleClose = () => {
    setIntervenants([]);
    onClose();
  };



  const submitIntervenants = async () => {
    try {
      const list = [];
      intervenants.forEach((inter) => list.push(inter.email));
      if (!list.length) {
        notify(NOTIFY_INFO, "pas d'intervenant sélectionné");
        return;
      }
      const res = await addIntervenants({
        body: { emails: list },
        projectID: projectID
      }).unwrap();
      notify(NOTIFY_SUCCESS, res?.message);
      handleClose();
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      {!updatingIntervenants && (
        <DialogTitle>Ajouter un intervenant</DialogTitle>
      )}
      <DialogContent className={externalProjectClasses.intevDialog}>
        {!updatingIntervenants ? (
          <>
            <ProjectUserLists
              externalClass={externalProjectClasses}
              multiple={true}
              list={potentialIntervenants}
              multipleValue={intervenants}
              handleChange={handleChange}
            />

            <AddBtn
              large={true}
              title="Ajouter les intervenants"
              // icon={faAddUser}
              handleAdd={submitIntervenants}
            />
          </>
        ) : (
          <>
            <Typography variant="h6" component="h6" sx={{ mb: 5 }}>
              Veuillez patienter, nous mettons à jour la liste des intervenants
              ...
            </Typography>
            <Loading color="var(--orange) " />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

AddIntervenant.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
  // selectedValue: PropTypes.string.isRequired
};

const ProjectIntervenant = () => {
  const { isSuperUser, isManager } = useIsUserCanAccess();
  const {user} = useGetAuthenticatedUser();
  const [getPotentielIntervenants] = useGetPotentielIntervenantsMutation();
  const [removeIntervenantFromProject] =
    useRemoveIntervenantFromProjectMutation();
  const [getProjectIntervenants, { isLoading }] =
    useGetProjectIntervenantsMutation();
  const project = useGetStateFromStore("project", "projectDetails");

  const { projectID } = useParams();
  const colors = useGetStateFromStore("userInfo", "avatarColors");

  const [potentielIntervenants, setPotentielIntervenants] = useState([]);
  const [intervenantsDialog, setIntervenantsDialog] = useState(false);
  const [intervenants, setIntervenants] = useState([]);
  const [detailIntervenant, setDetailIntervenant] = useState({
    open: false,
    details: undefined
  });
  const classes = projectDetails();

  const openAddIntervenant = () => {
    setIntervenantsDialog(true);
  };

  const closeAddIntervenant = () => {
    setIntervenantsDialog(false);
  };

  async function loadIntervenants() {
    try {
      const list = await getProjectIntervenants(projectID).unwrap();
      setIntervenants(list.intervenants);
      if ((isManager && user?.email === project?.managerDetails?.email ) || isSuperUser ) {
        const res = await getPotentielIntervenants(projectID).unwrap();
        setPotentielIntervenants(res?.users);

      }



    } catch (error) {
      notify(NOTIFY_ERROR, error?.data.message);
    }
  }

  useEffect(() => {

    loadIntervenants();
  }, [intervenantsDialog, projectID]);

  const showIntervenantDetails = (intervenant) => {
    if (
      detailIntervenant.open &&
      intervenant.user.email === detailIntervenant.details.user.email
    ) {
      setDetailIntervenant({ open: false, details: undefined });
      return;
    }
    setDetailIntervenant({ open: true, details: intervenant });
  };

  const removeIntervenant = async (email) => {
    try {
      const res = await removeIntervenantFromProject({
        body: { email },
        projectID
      }).unwrap();
      notify(NOTIFY_SUCCESS, res?.message);
      setDetailIntervenant({ open: false, details: undefined });
      setIntervenants((list) => {
        return list.filter((inter) => inter.user.email !== email);
      });
    } catch (error) {
      notify(NOTIFY_ERROR, error?.data?.message);
    }
  };
  return (
    <div>
      <div className={classes.intervenantsContainer}>
        {!isLoading ? (
          <>
            <AvatarGroup max={8} spacing={10}>
              {intervenants.map((intervenant, idx) =>
                intervenant?.user?.UserProfile?.image ? (
                  <Avatar
                    onClick={() => showIntervenantDetails(intervenant)}
                    key={idx}
                    className={`${classes.manager} ${
                      colors[idx % colors.length]
                    }`}
                    alt={`${intervenant?.user?.UserProfile?.name} ${intervenant?.user?.UserProfile?.lastName}`}
                    src={`${process.env.REACT_APP_SERVER_URL}${intervenant?.user?.UserProfile.image}`}
                  />
                ) : (
                  <Avatar
                    key={idx}
                    className={`${classes.manager} ${
                      colors[idx % colors.length]
                    }`}
                  >
                    {intervenant?.user?.UserProfile?.name[0]?.toUpperCase()}
                    {intervenant?.user?.UserProfile?.lastName[0]?.toUpperCase()}
                  </Avatar>
                )
              )}
            </AvatarGroup>
            {((isManager && project?.managerDetails?.email === user?.email) || isSuperUser) && (
                <>
                  <button onClick={openAddIntervenant}>
                    <ReactSVG src={faAdd} />
                  </button>
                  <AddIntervenant
                    open={intervenantsDialog}
                    onClose={closeAddIntervenant}
                    potentialIntervenants={potentielIntervenants}
                  />
                </>
              )}
          </>
        ) : (
          <Skeleton variant="circular" width={42} height={42} sx={{ mt: 1 }} />
        )}
      </div>
      {detailIntervenant.open && (
        <div className={classes.detailIntervenant}>
          <p className="email">{detailIntervenant.details.user.email}</p>
          <p className="name">
            {detailIntervenant.details.user.UserProfile.name}{" "}
            {detailIntervenant.details.user.UserProfile.lastName}
          </p>
          <p className="hours">nb d'heures: 10h</p>
          <button
            onClick={() =>
              removeIntervenant(detailIntervenant.details.user.email)
            }
          >
            retirer l'intervenant du projet
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectIntervenant;
