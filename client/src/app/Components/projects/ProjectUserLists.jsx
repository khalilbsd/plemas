import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import React from "react";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250
//     }
//   }
// };

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
  const colors = useGetStateFromStore("userInfo", "avatarColors");

  if (multiple)
    return (
      <FormControl className={externalClass.multipleUsers}>
        <InputLabel id={`multiple-chip-${label}`}>{label}</InputLabel>
        <Autocomplete
        multiple
        id={`multiple-${label}`}
        options={list}
        getOptionLabel={(option) => `${option.name} ${option.lastName}`}
        defaultValue={[]}
        // value={multipleValue}
        onChange={(event,value)=>handleChange(value)}
        filterSelectedOptions
        renderOption={(event,user,state)=>{

          return (
            <MenuItem key={state.index} value={user} onClick={event.onClick}>

            <div className={externalClass.manager}>
            {user?.image ? (
              <img
                src={`${process.env.REACT_APP_SERVER_URL}${user.image}`}
                className={externalClass.avatar}
                alt={`${user?.name}_${user?.lastName}-avatar`}
              />
            ) : (
              <span
                className={`${externalClass.avatar} ${
                  colors[state.index % colors.length]
                }`}
              >
                {user?.name && user?.lastName
                  ? `${user?.name[0].toUpperCase()} ${user?.lastName[0].toUpperCase()}`
                  : `${user.email[0]}`}
              </span>
            )}
            <div className="info">
              <span className="name">{`${user.name ? user.name : ""}  ${
                user.lastName ? user.lastName : ""
              }`}</span>
              <span className="email">{user.email}</span>
              <span className="poste">{user.poste}</span>
            </div>
          </div>
           </MenuItem>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label=""
            placeholder="Liste des intervenenants"
          />
        )}
      />

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
      {list.map((user, idx) => (
        <MenuItem className={externalClass.MenuItem} key={idx} value={user.id}>
          <div className={externalClass.manager}>
            {user.image ? (
              <img
                alt={`${user?.name}_${user?.lastName}-avatar`}
                src={`${process.env.REACT_APP_SERVER_URL}${user.image}`}
                className={externalClass.avatar}
              />
            ) : (
              <span
                className={`${externalClass.avatar} ${
                  colors[idx % colors.length]
                }`}
              >
                {user?.name &&
                  user?.lastName &&
                  `${user?.name[0].toUpperCase()} ${user?.lastName[0].toUpperCase()}`}
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
