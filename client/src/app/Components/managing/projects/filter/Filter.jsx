import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";
import { filterStyles } from "./style";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import { CustomArrowDownIcon } from "../../../icons";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const Filter = (props) => {
  const { items, handleChange, value, filterType, label } = props;
  const classes = filterStyles();

  const getInitials = (fullName) => {
    let first;
    let second;
    const splits = fullName.split(" ");
    first = splits[0] ? splits[0][0].toUpperCase() : "";
    second = splits[1] ? splits[1][0].toUpperCase() : "";

    return `${first}${second}`;
  };

  return (
    <div
      className={`${classes.filter} ${
        filterType === "manager.fullName" ? "wide" : ""
      }`}
    >
      {/* <FormControl fullWidth>
      <InputLabel >{label}</InputLabel>
        <Select
          color="info"
          value={value}
          labelId="select-label"
          IconComponent={()=><CustomArrowDownIcon className={classes.filterArrowIcon}/>}
          onChange={handleChange}
          size="small"
        >
          {filterType === "manager.fullName"
            ? items?.map((manager, idx) => (
                <MenuItem key={idx} value={manager}>
                  {manager.image ? (
                    <Avatar
                      sx={{ width: 24, height: 24 }}
                      alt={manager.fullName}
                      src={`${process.env.REACT_APP_SERVER_URL}${manager.image}`}
                    />
                  ) : (
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {getInitials(manager.fullName)}
                    </Avatar>
                  )}
                  <span className={classes.managerFullName}>
                    {" "}
                    {manager.fullName}
                  </span>
                </MenuItem>
              ))
            : items?.map((item, idx) => (
                <MenuItem key={idx} value={item}>
                  <span> {item}</span>
                </MenuItem>
              ))}
        </Select>
      </FormControl> */}
      {filterType === "manager.fullName" ? (
        <Autocomplete
          options={items}
          getOptionLabel={(option) => option?.fullName}
          onChange={(event, value)=>handleChange(value)}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
            {
              option.image ? (
                <Avatar
                sx={{ width: 24, height: 24 }}
                alt={option?.fullName}
                src={`${process.env.REACT_APP_SERVER_URL}${option.image}`}
                />
                ) : (
              <Avatar sx={{ width: 24, height: 24 }}>
                {getInitials(option?.fullName)}
              </Avatar>
              )
              }
              <span className={classes.managerFullName}>
                {" "}
                {option?.fullName}
              </span>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              size="small"
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password" // disable autocomplete and autofill
              }}
            />
          )}
        />
      ) : (
        <Autocomplete
        onChange={(event, value)=>handleChange(value)}
          options={items}
          renderInput={(params) => (
            <TextField {...params} label={label} size="small" />
          )}
        />
      )}
    </div>
  );
};

export default Filter;
