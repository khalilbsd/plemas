import { createUseStyles } from "react-jss";

export const filterStyles = createUseStyles({
  filters: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  filter: {
    width: "15%",
    '& .MuiInputBase-root.MuiOutlinedInput-root':{
      paddingRight:5,
      background: "var(--white)",
    },
    "&.wide": {
      width: "20%"
    },
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      fontWeight: 600
      //  color:'var(--white)',
      //  gap:10,
    },
    '& .css-3jdtmo-MuiFormLabel-root-MuiInputLabel-root':{
        // top:-5,
        fontSize:11
    },
    "& .css-xjos08-MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
      color: "var(--orange) !important"
    }
  },
  managerFullName: {
    marginLeft: "10px !important",
    fontWeight: 500
  },
  filterArrowIcon:{
    width:22,
  }
});
