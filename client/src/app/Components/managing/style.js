import { createUseStyles } from "react-jss";

export const btnStyle = createUseStyles({
  btn: {
    width: 200,
    height: 50,
    borderRadius: 5,
    color: "var(--white)",
    marginBottom: 10,
    border: "none",
    fontFamily: "'MyriadPro', sans-serif !important",
    display: "flex",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "var(--dark-green)",
    transition: "0.3s all ease-in-out",

    "&:hover": {
      backgroundColor: "var(--light-green)"
    }
  },
  icon: {
    width: 28,
    fill: "var(--white)"
  }
});
export const listStyle = createUseStyles({
  safeLabel: {
    fontWeight: 500,
    fontSize: 14,
    backgroundColor: "green",
    borderRadius: 10,
    color: "white",
    padding: "0px 20px",
    width: "fit-content",
    // margin:'auto',
    textAlign: "center"
  },
  redLabel: {
    fontWeight: 500,
    fontSize: 14,
    backgroundColor: "red",
    borderRadius: 10,
    color: "white",
    padding: "0px 20px",
    width: "fit-content",
    // margin:'auto',
    textAlign: "center"
  }
});

export const addUserFormStyles = createUseStyles({
  inputs: {
    width: "100%"
  },
  saveBtn: {
    width: "100%",
    padding: "15px 0",
    color: "var(--white)",
    border: "none",
    borderRadius: 5,
    backgroundColor: "var(--dark-green)",
    fontWeight: 500,
    textTransform: "capitalize",
    fontFamily: "'MyriadPro', sans-serif !important",
    fontSize: 16,
    transition: "0.3s all ease-in-out",
    "&:hover": {
      backgroundColor: "var(--light-green)"
    }
  },
  cancelBtn: {
    width: "100%",
    padding: "15px 0",
    color: "var(--white)",
    border: "none",
    borderRadius: 5,
    backgroundColor: "var(--orange)",
    fontWeight: 500,
    textTransform: "capitalize",
    fontFamily: "'MyriadPro', sans-serif !important",
    fontSize: 16,
    transition: "0.3s all ease-in-out",
    "&:hover": {
      opacity: 0.8
    }
  }
});

export const projectsStyles = createUseStyles({
  projectsPage: {
    height: "100%"
  },
  listContainer: {
    minHeight: "",
    height:'calc(80vh - 20px)',
    maxHeight:'80vh',
    // overflowY:'scroll',
    backgroundColor: "var(--white)",
    boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
    borderRadius: 30,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    paddingBottom:20,
  },
  headers: {
    backgroundColor: "var(--light-green)",
    color: "var(--white)",
    display: "flex",
    alignItems: "flex-start",
    padding: '20px 40px'  ,
    width: "100%",
    height: 90,
    justifyContent: "space-around"
  },
  content: {
    padding: 20,
    marginTop: -40,
    height: "100%",
    // maxHeight: "60%",
    boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
    background: "white",
    borderRadius: 10,
    width: "calc(100% - 120px)",
    margin: "auto"
  },
  rowData:{
    display:'flex',
    padding:5,
    width:'100%',
    borderRadius:10,
    justifyContent:'space-between',
    transition:'all 0.3s ease-in-out',
    '&:hover':{
        backgroundColor:'var(--app-bg-color)'
    }
  },

});
