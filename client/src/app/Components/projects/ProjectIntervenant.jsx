import React, { useState } from "react";
import faAdd from "../../public/svgs/light/plus.svg";
import { ReactSVG } from "react-svg";
import { projectDetails } from "./style";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";

const emails = ["username@gmail.com", "user02@gmail.com"];

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Ajouter un intervenant</DialogTitle>
      <List sx={{ pt: 0 }}>
        {emails.map((email) => (
          <ListItem disableGutters key={email}>
            <ListItemButton onClick={() => handleListItemClick(email)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  Fa
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={email} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("addAccount")}
          >
            <ListItemAvatar>
              <Avatar>
                <ReactSVG src={faAdd} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired
};

const ProjectIntervenant = () => {
  const [intervenants, setIntervenants] = useState(false);
  const classes = projectDetails();
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const openAddIntervenant = () => {
    setIntervenants(true);
  };

  const closeAddIntervenant = (value) => {
    setSelectedValue(value);
    setIntervenants(false);
  };

  return (
    <div className={classes.intervenantsContainer}>
      <p>,dkjfhkhd</p>
      <button onClick={openAddIntervenant}>
        <ReactSVG src={faAdd} />
      </button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={intervenants}
        onClose={closeAddIntervenant}
      />
    </div>
  );
};

export default ProjectIntervenant;
