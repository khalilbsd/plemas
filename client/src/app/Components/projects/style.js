import { createUseStyles } from "react-jss";

export const projectDetails = createUseStyles({
  projectDetailsPage: {
    height: "100%",
    width: "100%"
  },
  card: {
    backgroundColor: "var(--white)",
    borderRadius: 30,
    overflow: "hidden",
    transition: "all 0.2s ease-in-out",
    "&.colored": {
      backgroundColor: "var(--light-green)"
    }
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
    minHeight: 40,
    background: "var(--light-green)",
    color: "var(--white)",
    width: "100%",
    maxWidth: "100%",
    height: "100%",

    display: "flex",
    alignItems: "center",
    "& .headerInfo": {
      transition: "all 0.2s ease-in-out",
      whiteSpace: "nowrap",
      textWrap: "wrap",
      "&.hidden": {
        width: "0 ",
        overflow: "hidden ",
        opacity: 0
      },
      "&.collapsed": {
        opacity: 1,
        width: "100% !important"
      }
    }
  },
  seeMoreProject: {
    background: "none",
    border: "none",
    color: "var(--white)",
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
    gap: 10,
    transition: "all 0.2s ease-in-out",
    borderRadius: 30,
    padding: 10,
    marginLeft: "auto",
    "&:hover": {
      background: "var(--pastel-green)"
    },
    "& svg": {
      width: 18,
      fill: "var(--white)"
    }
  },
  projectTitle: {
    margin: 0,
    fontSiz: 24
  },

  mainInfo: {
    backgroundColor: "var(--white)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    transition: "all 0.3s ease-in-out",
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden",
    position: "relative",
    opacity: 0,
    "&.hidden": {
      height: 0,
      overflow: "hidden"
    },
    "&.collapsed": {
      opacity: 1,
      paddingTop: 20,
      paddingBottom: 20,
      height: "auto",
      overflow: "visible"
    }
  },
  mainInfoSkeleton: {
    minHeight: 600,
    backgroundColor: "var(--pastel-green) !important",
    width: "100%",
    height: "100%",
    borderRadius: "30px !important",
    padding: 20
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 600,
    margin: 0,
    textTransform: "capitalize"
  },
  data: {
    marginTop: 10,
    "& .label": {
      fontSize: 14,
      fontStyle: "italic",
      fontWeight: 600,
      margin: 0
    },
    "& .value": {
      fontWeight: 700
    }
  },
  manager: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    "& img": {
      height: 52,
      width: 52,
      borderRadius: "100%"
    },
    "& .initials": {
      backgroundColor: "var(--orange)",
      height: 52,
      width: 52,
      minWidth: 52,
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
  },
  priority: {
    position:'relative',
    // overflow: "hidden",
    display:'flex',
    justifyContent: "center",

    "& .circle": {
      width: 52,
      height: 52,
      borderRadius: "100%",

    }
  },
  priorityUpdateContainer:{
    position:'absolute ',
    bottom:'-70%',

    left:'auto',
    right:'auto',
    zIndex:999,

    width:'auto',
    backgroundColor:'var(--white)',
    borderRadius:15,
    border:'1px solid var(--app-bg-color)',

  },
  actions: {
    position: "absolute",
    bottom: 20,
    right: 20,
    display:'flex',
    justifyContent:'flex-end',
    alignItems:'center',
    gap:20,
    minWidth:100,
    "& button": {
      height: 42,
      minWidth: 42,
      width: 42,
      borderRadius: "100%",
      overflow: "hidden",
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      transition:'width 0.2s ease-in-out',
      '& .text':{
        width:0,
        overflow:'hidden',
        transition:'all 0.2s ease-in-out',
      },
      "& svg": {
        height: 20,
        width: 20,
        fill:'var(--white)'
      },
      '&:hover':{
        borderRadius:30,
        width:'100%',
        '& .text':{
          width:'100%',
          marginLeft:5
        },
      },
      color:'var(--white)',
      backgroundColor:'var(--light-green)',
      border:'none',
      '&.cancel':{
        backgroundColor:'var(--toastify-color-error)',
      }

    },
  },
  intervenantsContainer:{

    display:'flex',

    alignItems:'center',

  '& button':{
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      width:42,
      border:'none',
      backgroundColor:'var(--app-bg-color)',
      height:42,
      borderRadius:'100%',
      marginLeft:10,
      transition:'0.2s all ease-in-out',
      '&:hover':{
        backgroundColor:'var(--orange)',
        '& svg':{
          fill:'var(--white)',
        }
      },
      '& svg':{
        width:18,
        height:18,
        fill:'var(--orange)'
      }
    }
  }
});
