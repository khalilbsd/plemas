import { createUseStyles } from "react-jss";

export const projectDetails = createUseStyles({
  projectDetailsPage: {
    height: "100%"
  },
  card: {
    backgroundColor: "var(--white)",
    borderRadius: 30,
    overflow: "hidden"
  },
  headerSkeleton: {
    minHeight: 200,
    backgroundColor: "var(--pastel-green) !important",
    width: "100%",
    height: "100%",
    borderRadius: "30px !important",
    padding: 20
  },
  projetHeader: {
    minHeight: 100,
    background: "var(--light-green)",
    color: "var(--white)",
    width: "100%",
    height: "100%",
    padding: 20,
    display: "flex",
    alignItems: "center"
  },
  projectTitle: {
    margin: 0,
    fontSiz: 24
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 500,
    fontStyle: "initial",
    margin: 0
  },
  kApiContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-evenly"
  },
  keyFigure: {
    backgroundColor: "var(--white)",
    height: 100,
    width: 100,
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    position: "relative",
    "& .content": {
      flexDirection: "column",
      justifyContent: "space-around",
      display: "flex",
      padding: 20
    },
    "& .value": {
      color: "var(--black)",
      fontSize: 28,
      fontWeight: 800,
      margin: 0
    },
    "& .labels": {
      color: "var(--black)",
      fontSize: 14,
      fontWeight: 600,
      margin: 0
    },
    "& .icon": {
      position: "absolute",
      right: -10,
      bottom: -10,
      width: 34,
      height: 34,
      background: "var(--white)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "100%",
      border: "1px solid  var(--orange)",
      "& svg": {
        fill: "var(--orange)",
        height: 18,
        width: 18
      }
    }
  },
  mainInfo: {
    padding: 20
  },
  mainInfoSkeleton:{
    minHeight:600,
    backgroundColor: "var(--pastel-green) !important",
    width: "100%",
    height: "100%",
    borderRadius: "30px !important",
    padding: 20
  },
  sectionTitle:{
    fontSize:24,
    fontWeight:600,
    margin:0,
    textTransform:'capitalize'
  },
  data:{
    marginTop:10,
    '& .label':{
        fontSize:14,
        fontStyle:'italic',
        fontWeight:600,
        margin:0
    },
    '& .value':{
        fontWeight:700
    }
  },
  manager: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    '& img':{
      height: 52,
      width: 52,
      borderRadius: "100%",
    },
    "& .initials": {
      backgroundColor: "var(--orange)",
      height: 52,
      width: 52,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "100%",
      color: "var(--white)",
      fontSize: 24
    },
    "& .manager-name": {
      fontWeight: 600,
      fontSize: 16,
      "& .email": {
        fontWeight: 500,
        color: "grey"
      }
    }
  }
});
