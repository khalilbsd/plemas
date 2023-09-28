import { createUseStyles } from "react-jss";

export const styles = createUseStyles({
  sidebar: {
    height: "100%",

    '& .ps-sidebar-container':{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingBottom:30,
    height: 'calc(100vh - 30px)'
    }
  },
  sidebarHeader: {
    height: 50,
    padding: 14,
    borderBottom: "1px solid lightgrey",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    "& img": {
      width: "50px"
      // height:'100%'
    }
  },
  companyName: {
    fontWeight: "bold",
    fontSize: 16
  },
  bars: {
    height: 40,
    width: 50,
    padding: 0,
    color: "white",
    //temporarly
    backgroundColor: "#060623",
    border: "none",
    borderRadius: 10
  },

  link: {
    fontWeight: 500,
    color: "black",
    textTransform: "capitalize",
    fontSize: 14,
    "& a:hover": {
      backgroundColor: "#EFE7DE !important"
    }
  },
  linkIcon: {
    width: 18,
    height: 25,
    // color:'#754619',
    fill: "#754619"
  }
});
