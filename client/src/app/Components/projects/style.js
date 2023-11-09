import { createUseStyles } from "react-jss";

export const projectDetails = createUseStyles({
  projectDetailsPage: {
    height: "100%",
    width: "100%",
    display: "flex",

    alignItems: "center",
    flexDirection: "column"
  },
  card: {
    position: "relative",
    backgroundColor: "var(--white)",
    borderRadius: 30,
    overflow: "hidden",
    transition: "all 0.2s ease-in-out",
    "&.colored": {
      backgroundColor: "var(--light-green)"
    },
    "&.internal": {
      display: "flex",
      alignItems: "center",
      height: "100%",
      // paddingTop:20,
      padding: 10
    },
    "&.transparent": {
      backgroundColor: "unset"
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
  projectHeader: {
    minHeight: 40,
    background: "var(--light-green)",
    color: "var(--white)",
    width: "100%",
    maxWidth: "100%",
    height: "100%",
    borderRadius: 30,
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
  searchProjectByTitle:{
    display:'flex',
    alignItems:'center',
    gap:10,
    '& .search':{
      background:'none',
      border:'none',
      '& svg':{
        width:22,
        height:22,
        fill:'var(--white)'
      }
    }
  },
  search:{
    width:'40%'
  },
  mainInfo: {
    backgroundColor: "var(--app-bg-color)",
    transition: "all 0.3s ease-in-out",
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
      fontWeight: 700,
      display: "flex",
      alignItems: "center"
    },
    "& .position": {
      fontWeight: 500,
      width:150,
      color: "var(--orange)",
      border: "2px solid var(--orange)",
      padding: 15,
      borderRadius: 5,
      marginLeft: "5%",
      background:'none',
      transition:'all 0.3s ease-in-out',
      '& .init':{
        height:14,
        display:'block',
        width:'100%',
        overflow: "block"
      },
      '& .changed':{
        height:0,
        display:'block',
        width:0,
        overflow: "hidden"
      },
      '&:hover':{

      backgroundColor: "var(--orange)",
      color:'var(--white)',
      '& .changed':{
        height:14,
        width:'100%',
        overflow: "visible"
      },
      '& .init':{
        height:0,
        width:0,
        overflow: "hidden"
      },

      }
    }
  },
  manager: {
    display: "flex",
    gap: 10,
    alignItems: "center",

    "& img": {
      height: 52,
      width: 52,
      borderRadius: "100%",
      objectFit: "fill"
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
    "&.small": {
      height: "32px !important",
      width: "32px !important",
      fontSize: 18,
      "& img": {
        height: 32,
        width: 32
      },
      "& .initials": {
        minWidth: "32px !important",
        height: 32,
        width: 32,
        fontSize: 18
      }
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
    position: "relative",
    // overflow: "hidden",
    display: "flex",
    justifyContent: "center",

    "& .circle": {
      width: 52,
      height: 52,
      borderRadius: "100%"
    }
  },
  priorityUpdateContainer: {
    position: "absolute ",
    bottom: "-70%",

    left: "auto",
    right: "auto",
    zIndex: 999,

    width: "auto",
    backgroundColor: "var(--white)",
    borderRadius: 15,
    border: "1px solid var(--app-bg-color)"
  },
  actions: {
    position: "absolute",
    bottom: 20,
    right: 20,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
    minWidth: 100,
    "&.pr ": {
      position: "unset",
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      "& button:hover": {
        width: 100
      }
    },
    "&.top": {
      bottom: "unset",
      top: 20
    },
    "&.right": { right: 20 },
    "& button": {
      height: 42,
      minWidth: 42,
      width: 42,
      borderRadius: "100%",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "width 0.2s ease-in-out",
      "& .text": {
        width: 0,
        overflow: "hidden",
        transition: "all 0.2s ease-in-out"
      },
      "& svg": {
        height: 20,
        width: 20,
        fill: "var(--white)"
      },
      "&:hover": {
        borderRadius: 30,
        width: "100%",
        "& .text": {
          width: "100%",
          marginLeft: 5
        }
      },
      color: "var(--white)",
      backgroundColor: "var(--light-green)",
      border: "none",
      "&.cancel": {
        backgroundColor: "var(--toastify-color-error)"
      }
    }
  },
  intervenantsContainer: {
    display: "flex",
    marginTop: 1,
    alignItems: "center",

    "& button": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 52,
      border: "none",
      backgroundColor: "var(--app-bg-color)",
      height: 52,
      borderRadius: "100%",
      marginLeft: 10,
      transition: "0.2s all ease-in-out",
      "&:hover": {
        backgroundColor: "var(--orange)",
        "& svg": {
          fill: "var(--white)"
        }
      },
      "& svg": {
        width: 28,
        height: 28,
        fill: "var(--orange)"
      }
    },

    "&.small": {
      "& button": {
        width: 32,
        height: 32,
        "& svg": {
          width: 22,
          height: 22
        }
      }
    }
  },
  detailIntervenant: {
    backgroundColor: "var(--app-bg-color)",
    padding: 10,
    borderRadius: 20,
    marginTop: 5,
    width: "fit-content",
    "& p": {
      fontSize: 14,
      margin: 0,
      "&.email, &.name": {
        fontWeight: 600,
        marginBottom: 10
      },
      "&.hours": {
        color: "var(--orange)",
        border: "2px solid var(--orange)",
        borderRadius: 5,
        width: "fit-content",
        padding: 15,
        fontWeight: 600,
        fontSize: 12
      }
    },
    "& button": {
      "&[disabled]": {
        opacity: 0.5
      },
      marginTop: 15,
      background: "var(--toastify-color-progress-error)",
      color: "var(--white)",
      height: 40,
      borderRadius: 10,
      border: "none",
      width: "100%"
    }
  }
});

export const projectTaskDetails = createUseStyles({
  skeleton: {
    width: "100%",
    height: "400px !important",
    transform: " none !important",
    backgroundColor: "var(--pastel-green) !important",
    borderRadius: "30px !important"
  },
  addTaskForm: {
    position: "relative",
    background: "var(--white)",
    width: "100%",
    maxWidth: "calc(100% - 40px)",
    borderRadius: 30,
    padding: 20
  },
  inputs: {
    width: "100%"
  },
  joiBtn: {
    minWidth: 100,
    height: "80%",
    background: "none",
    border: "none",
    backgroundColor: "var(--orange)",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 600,
    color: "var(--white)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "var(--pastel-orange)"
    }
  },
  joinBtnSkeleton: {
    width: 100,
    height: "80%"
  },
  intervenantsSkeleton: {
    width: 150,
    height: "80%"
  },
  persistHours: {
    width: "100%",
    height: 50,
    background: "none",
    border: "none",
    backgroundColor: "var(--orange)",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 600,
    color: "var(--white)",
    transition: "all 0.3s ease-in-out",
    marginTop: 10,
    "&:hover": {
      backgroundColor: "var(--pastel-orange)"
    },
    display:'flex',
    alignItems:'center',
    justifyContent: 'center',
    gap:10
  },
  btnLoader:{
    width:'20%',
    '& span':{
      height:'28px !important',
      width:'28px !important'
    }
  },
  btnSaveIcon:{
    height:22,
    width:22,
    '& svg':{
      height:22,
      width:22,
      fill:'var(--white)'
    }
  },

  icon: {
    width: 18,
    height: 18
  },
  task: {
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 5,
    padding: 8,
    border: "2px solid",
    flex: 1,
    display:'block',
    width:'100%',
    textAlign: "center",
    "&.doing": {
      color: "var(--orange)",
      borderColor: "var(--orange)"
    },
    "&.done": {
      color: "var(--dark-green)",
      borderColor: "var(--dark-green)"
    },
    "&.abandoned": {
      color: "var(--black)",
      borderColor: "var(--black)"
    },
    "&.blocked": {
      color: "var(--toastify-icon-color-error)",
      borderColor: "var(--toastify-icon-color-error)"
    }
  }
});
