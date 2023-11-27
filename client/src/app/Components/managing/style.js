import { createUseStyles } from "react-jss";

export const btnStyle = createUseStyles({
  btn: {
    width: 200,
    "&.large": {
      width: "100%"
    },
    height: 50,
    borderRadius: 5,
    color: "var(--white)",
    // marginBottom: 10,
    border: "none",
    fontFamily: "'MyriadPro', sans-serif !important",
    display: "flex",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",

    transition: "0.3s all ease-in-out",

    "&.danger": {
      backgroundColor: "var(--toastify-color-progress-error)",
      "&:hover": {
        opacity: 0.8
      }
    },
    "&.warning": {
      backgroundColor: "var(--orange)",
      "&:hover": {
        opacity: 0.8
      }
    },
    "&.normal": {
      backgroundColor: "var(--dark-green)",
      "&:hover": {
        backgroundColor: "var(--light-green)"
      }
    }
  },
  icon: {
    width: 18,
    fill: "var(--white)"
  }
});
export const listStyle = createUseStyles({
  safeLabel: {
    fontWeight: 600,
    fontSize: 14,
    // padding: "0px 20px",
    width: "150px",
    // margin:'auto',
    textAlign: "center",
    color: "var(--dark-green)",
    borderRadius: 4,
    padding: "5px 00px",
    border: "2px solid var(--dark-green)"
  },
  redLabel: {
    fontWeight: 600,
    fontSize: 14,
    color: "var(--toastify-icon-color-error)",
    borderRadius: 4,
    padding: "5px 00px",
    width: "150px",
    // margin:'auto',
    textAlign: "center",
    border: "2px solid var(--toastify-icon-color-error)"
  },
  roleBtn: {
    background: "none",
    border: "none",
    width: "100%",
    textAlign: "left",
    height: "100%"
  },
  list: {
    height: "calc(100% - 53px) !important",
    borderRadius: "30px !important",
    overflow: "hidden !important",
    background: "var(--white)",

    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "var(--light-green)",
      color: "var(--white)",
      "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: "600 !important"
      },
      height: "90px !important",
      maxHeight: "90px !important",
      "& .MuiDataGrid-columnHeadersInner": {
        width: "98%",
        margin: "auto"
      }
    },
    "& .MuiDataGrid-virtualScroller": {
      width: "98%",
      margin: "auto",
      marginTop: -20,
      /* z-index: 999999999999999999999999999999999999999999999999999999999999999999999999; */
      position: "relative",
      background: "var(--white)",
      borderRadius: 15,
      // border: '1px solid var(--app-bg-color)',
      boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
      marginBottom: 20,
      maxHeight: "100% !important",
      height: "100% !important",
      overflow: "visible !important",
      overflowX: "hidden !important",
      overflowY: "auto !important",
      "&::-webkit-scrollbar": {
        width: "8px"
      },

      "&::-webkit-scrollbar-track": {
        WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
        borderRadius: "10px"
      },
      "&::-webkit-scrollbar-thumb": {
        borderRadius: "10px",
        // WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)',
        background: "var(--pastel-green)"
      },
      "& .MuiDataGrid-virtualScrollerContent":{
        height:'100% !important'
      }
    },
    "& .MuiDataGrid-row, .MuiDataGrid-cell ": {
      minHeight: "42px !important",
      maxHeight: "42px !important",
      border: "none !important"
    },
    "&.integrated": {

      overflow: "visible !important",
      "& .MuiDataGrid-main": {
        overflow: "visible"
      },
      "& .MuiDataGrid-columnHeaderTitleContainerContent": {
        width: "100%",
        overflow: "visible"
      },
      "& .MuiDataGrid-columnHeaderTitleContainer": {
        overflow: "visible"
      },
      borderTopLeftRadius: "0px !important",
      borderTopRightRadius: "0px !important",
      background: "transparent !important",
      border: "none",
      "& .MuiDataGrid-columnHeaders": {
        borderRadius: 0,
        overflow: "visible",
        //   height: "170px !important",
        // maxHeight: "170px !important",
        "& .MuiDataGrid-columnHeader": {
          paddingLeft: "0 !important"
        }
      },
      "& .MuiDataGrid-row, .MuiDataGrid-cell ": {
        minHeight: "42px !important",
        maxHeight: "unset !important",
        border: "none !important",
        alignItems: "flex-start",
        padding: "7px 0"
      },
      "& .MuiDataGrid-overlayWrapperInner": {
        height: "600px !important"
      }
    },
    "& .notTreatedRequest": {
      backgroundColor: "#e74c3c2e !important"
    },
    "& .MuiDataGrid-footerContainer": {
      display: "none !important"
    }
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
    height: "100%",
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
    height: "100%",
    width: "100%"
  },

  empty: {
    margin: "auto",
    width: "60%",
    fontSize: 18,
    color: "lightgrey",
    textAlign: "center"
  },
  listContainer: {
    backgroundColor: "var(--white)",
    boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
    borderRadius: 30,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    paddingBottom: 20
    // transition:'all 0.3s ease-in-out'
  },
  header: {
    backgroundColor: "var(--light-green)",
    padding: "20px 20px",
    width: "calc(100% - 40px)"
  },
  headersItem: {
    display: "flex",
    "& .static-data": {
      // width:'100%',
      color: "var(--white)",
      display: "flex",
      alignItems: "flex-start",
      width: "calc(100% - 40px)",
      minHeight: 90,
      justifyContent: "space-between",
      fontWeight: 600,
      fontSize: 14
    }

    // padding:'0 20px'
  },
  datesData: {
    color: "var(--white)",
    display: "flex",
    alignItems: "flex-center",
    width: "calc(100% - 40px)",
    minHeight: 60,
    fontWeight: 600,
    fontSize: 14
  },

  column: {
    fontSize: 14,
    textWrap: "nowrap",
    whiteSpace: "nowrap"
  },
  dateColumn: {
    textWrap: "nowrap",
    whiteSpace: "nowrap",
    position: "relative",
    width: 50,
    height: 50,
    display:'flex',
    alignItems:'flex-end'
  },
  dateTitle: {
   lineHeight:'40px',
   margin:0,
    fontSize: 12,
    textWrap: "nowrap",
    whiteSpace: "nowrap",
    // margin: "0 -100%",
    "&.disabled": { opacity: 0.5 }
  },
  content: {
    padding: 20,
    marginTop: -40,
    height: "100%",
    // maxHeight: "60%",
    boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
    background: "white",
    borderRadius: 10,
    width: "calc(100% - 80px)",
    margin: "auto",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "8px"
    },

    "&::-webkit-scrollbar-track": {
      WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
      borderRadius: "10px"
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "10px",
      // WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)',
      background: "var(--pastel-green)"
    },
    "& .row-data": {
      display: "flex",
      padding: "5px 0",
      margin: "5px 0",
      width: "100%",
      borderRadius: 10,
      justifyContent: "space-between",
      transition: "all 0.3s ease-in-out",
      alignItems: "center",
      "&:hover": {
        backgroundColor: "var(--app-bg-color)"
      },
      "&.active": {
        backgroundColor: "var(--pastel-green)"
        // color:'var(--white)'
      }
    }
  },
  progressBarContainer: {
    height: 32,
    display: "flex"
  },
  progressBar: {
    paddingLeft:10,
    fontWeight:600,
    height: 20,
    borderRadius: 5,
    backgroundColor: "var(--bright-orange)",
    width: "100%",
    "&.empty": {
      backgroundColor: "var(--app-bg-color)"
    }
  },
  dataList: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
    fontSize: 14
  },
  // avatar: {
  //   width: 32,
  //   height: 32,
  //   borderRadius: "100%",
  //   "&.holder": {
  //     fill: "var(--orange)",
  //     "& svg": {
  //       width: 32,
  //       height: 32
  //     }
  //   }
  // },
  addBtnContainer: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    "& button": {
      backgroundColor: "unset",
      border: "none",
      borderRadius: "100%",
      height: 32,
      width: 32,
      transition: "0.3s all ease-in-out",
      "&:hover": {
        backgroundColor: "var(--pastel-green)"
      },
      "& svg": {
        fill: "var(--white)",
        height: 22,
        width: 22
      }
    }
  },
  modalActionBtn: {
    position: "absolute",
    right: 20,
    top: -16,
    display: "flex",
    gap: 25,

    "& button": {
      backgroundColor: "unset",
      outline: "none",
      border: "none",
      width: 32,
      height: 32,
      borderRadius: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease-in-out",
      "&.close": {
        backgroundColor: "var(--toastify-color-error)"
      },
      "&.submit": {
        backgroundColor: "var(--dark-green)"
      },
      "&:hover": {
        backgroundColor: "lightgrey"
      }
    },
    "& svg": {
      width: 22,
      height: 22,
      fill: "white"
    }
  },
  modalTitle: {
    fontWeight: 600
  },
  info: {
    fontSize: 14
  },
  textWarning: {
    fontSize: 14,
    "& .warning": {
      fontWeight: 600,
      color: "var(--orange)"
    }
  },
  labels: {
    marginBottom: 10,
    fontWeight: 600,
    fontSize: 14,
    fontStyle: "italic",
    display: "block"
  },
  manager: {
    lineHeight: "12px",
    display: "flex",
    gap: 10,
    alignItems: "center",
    "& .info": {
      display: "flex",
      flexDirection: "column",
      "& .name": {
        fontWeight: 600,
        fontSize: 14
      },
      "& .email, .poste": {
        color: "grey",
        fontSize: 13,
        fontWeight: 500
      }
    }
  },
  avatar: {
    "&:not(.chip)": {
      width: 32,
      minWidth: 32,
      height: 32,
      fontWeight: 600
    },
    color: "var(--white) !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "100%",
    fontSize: 13,
    "&.light-green": {
      backgroundColor: "var(--light-green)"
    },
    "&.dark-green": {
      backgroundColor: "var(--dark-green)"
    },
    "&.orange": {
      backgroundColor: "var(--orange)"
    },
    "&.bright-orange": {
      backgroundColor: " var(--orange)"
    },

    "&.black": {
      backgroundColor: "var(--black)"
    }
  },
  managerContainer: {
    display: "flex",
    gap: 5,
    alignItems: "center"
  },
  managerFullName: {
    margin: 0,
    whiteSpace: "normal"
  },
  verificationMessage: {
    color: "grey",
    width: "70%",
    marginTop: 30,
    display: "block",
    margin: "auto",
    textAlign: "center"
  },
  data: {
    margin: 0,
    fontWeight: 500,
    fontSize: 16,
    "& .chip": {
      marginRight: 10,
      fontWeight: 600
    },
    "&.disabled": {
      color: "grey",
      fontSize: 13
    }
  },
  projectChoice: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "unset",
    textAlign: "left",
    margin: "5px 0 ",
    height: 70,
    border: "1px solid lightgrey",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "10px 20px",
    transition: "all  0.3s ease-in-out",
    "& .bold": {
      fontWeight: 600,
      fontSize: 14,
      color: "var(--black)"
    },
    fontSize: 13,
    color: "darkgrey",
    "&:hover": {
      backgroundColor: "var(--pastel-green)"
    },
    "&[disabled]": {
      "& .bold": {
        color: "grey"
      },
      "&:hover": {
        backgroundColor: "var(--app-bg)"
      }
    }
  },
  addProjectForm: {
    backgroundColor: "var(--white)",
    padding: "20px 40px ",
    borderRadius: 30,
    position: "relative"
  },
  // managerSelect:{
  //   '& .MuiSelect-select':{
  //     padding:11

  //   }
  // }
  hidden: {
    display: "none"
  },
  priorityContainer: {
    justifyContent: "space-evenly"
  },
  priorityFiled: {
    height: 30,
    width: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& button": {
      width: "100%",
      height: "100%",
      border: "none",
      outline: "none",
      borderRadius: "100%",
      "&:hover": {
        opacity: 0.7
      },
      "&.active": {
        border: "2px solid var(--black)"
      }
    }
  },
  formSkeleton: {
    width: "100%",
    height: "170px !important",
    backgroundColor: "var(--pastel-green) !important"
  },
  search: {
    width: "30%",
    // backgroundColor:'var(--white)',
    backgroundColor: "white",
    borderRadius: 5,
    "& label[data-shrink=true]": {
      color: "var(--orange) !important"
    }
  },
  intevDialog: {
    width: 300
  },
  multipleUsers: {
    marginBottom: "5px !important",
    width: "100%"
  },
  taskStates: {
    height: 32,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontWeight:600
  },
  projectName: {
    margin: 0,
    paddingLeft: 5,
    position: "relative",
    display: "flex",
    "& .priority": {
      display: "block",
      marginRight: 5,
      width: 18,
      height: 18,
      borderRadius: "100%"
    }
  },

  task: {
    borderLeft: "1px solid var(--app-bg-color)",
    paddingLeft: 5 ,
    width:'90%'
  },
  emptyTasks: {
    margin: 0,
    color: "var(--bright-orange)",
    whiteSpace: "normal"
  },
  lot:{
    margin:0,
    marginRight:5
  }
});
