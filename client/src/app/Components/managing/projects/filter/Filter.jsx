import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React from "react";
import { filterStyles } from "./style";

const Filter = (props) => {
  const { items, handleChange, filterType, label } = props;
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
