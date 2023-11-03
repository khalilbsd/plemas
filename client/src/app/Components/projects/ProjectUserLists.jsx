import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const ProjectUserLists = ({
  handleChange,
  userValue,
  list,
  externalClass,
  classes,
  multiple,
  label,
  multipleValue
}) => {
    const colors = useGetStateFromStore("userInfo","avatarColors")


  if (multiple)
    return (
      <FormControl className={externalClass.multipleUsers}>
        <InputLabel id={`multiple-chip-${label}`}>{label}</InputLabel>
        <Select
          labelId={`multiple-chip-${label}`}
          id={`multiple-${label}`}
          multiple
          value={multipleValue}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-${label}" label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value,idx) => (
                <Chip
                  avatar={
                    value.image ? (
                      <Avatar
                        alt={value.name}
                        src={`${process.env.REACT_APP_SERVER_URL}${value.image}`}
                      />
                    ) : (
                      <Avatar className={`${externalClass.avatar} ${colors[idx % colors.length]} chip`} >
                        {value?.name[0].toUpperCase()}{value?.lastName[0].toUpperCase()}
                      </Avatar>
                    )
                  }
                  key={value.id}
                  label={`${value.name} ${value.lastName}`}
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {list.map((user,idx) => (
            <MenuItem key={user.id} value={user}>
              <div className={externalClass.manager}>
                {user?.image ? (
                  <img
                    src={`${process.env.REACT_APP_SERVER_URL}${user.image}`}
                    className={externalClass.avatar}
                  />
                ) : (
                  <span className={`${externalClass.avatar} ${colors[idx % colors.length]}`}>
                    {user?.name[0].toUpperCase()}
                    {user?.lastName[0].toUpperCase()}
                  </span>
                )}
                <div className="info">
                  <span className="name">{`${user.name} ${user.lastName}`}</span>
                  <span className="email">{user.email}</span>
                  <span className="poste">{user.poste}</span>
                </div>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );

  return (
    <Select
      name="manager"
      labelId="manager-select-label"
      id="manager"
      size="small"
      sx={{ maxWidth: "100%", textOverflow: "ellipsis" }}
      // value={editedProject.manager}
      value={userValue}
      onChange={handleChange}
    >
      {/* {editData.managers.map((manager, managerIdx) => ( */}
      {list.map((user,idx) => (
        <MenuItem
          className={externalClass.MenuItem}
          key={user.id}
          value={user.id}
        >
          <div className={externalClass.manager}>
            {user.image ? (
              <img
                src={`${process.env.REACT_APP_SERVER_URL}${user.image}`}
                className={externalClass.avatar}
              />
            ) : (
              <span className={`${externalClass.avatar} ${colors[idx % colors.length]}`}>
                {user.name[0].toUpperCase()}
                {user.lastName[0].toUpperCase()}
              </span>
            )}
            <div className="info">
              <span className="name">{`${user.name} ${user.lastName}`}</span>
              <span className="email">{user.email}</span>
              <span className="poste">{user.poste}</span>
            </div>
          </div>
        </MenuItem>
      ))}
    </Select>
  );
};

export default ProjectUserLists;
