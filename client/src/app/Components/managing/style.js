import { createUseStyles } from "react-jss";

export const btnStyle = createUseStyles({
  btn: {
    width: 200,
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
    height:'100%',
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
    // height: "calc(80vh - 20px)",
    maxHeight: "80vh",
    // overflowY:'scroll',
    backgroundColor: "var(--white)",
    boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
    borderRadius: 30,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    paddingBottom: 20
  },
  header:{
    backgroundColor: "var(--light-green)",
    padding: "20px 40px",
    width:'calc(100% - 80px)'
  },
  headersItem: {

    color: "var(--white)",
    display: "flex",
    alignItems: "flex-start",
    width: "calc(100% - 40px)",
    height: 90,
    justifyContent: "space-between",
    fontWeight: 600,
    // padding:'0 20px'
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
    overflowY:'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
  },

  '&::-webkit-scrollbar-track': {
      WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
      borderRadius: '10px',
  }
   ,
  '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      // WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)',
    background:'var(--pastel-green)'
    },
    "& .row-data": {
      display: "flex",
      padding: '5px 0',
      margin: "5px 0",
      width: "100%",
      borderRadius: 10,
      justifyContent: "space-between",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        backgroundColor: "var(--app-bg-color)"
      },
      '&.active':{
        backgroundColor:'var(--pastel-green)',
        // color:'var(--white)'
      }
    },
  },
  dataList: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex:1
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
    justifyContent: "flex-end"
  },
  closeModalBtn: {
    position: "absolute",
    right: 20,
    top: -16,
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
      backgroundColor: "var(--toastify-color-error)",
      "&:hover": {
        backgroundColor: "lightgrey"
      }
    },
    "& svg": {
      width: 22,
      height: 22,
      fill:'white',
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
    marginBottom:10,
    fontWeight:600,
    fontSize:14,
    fontStyle:'italic',
    display:'block'

  },
  manager:{
    lineHeight:'12px',
    display:'flex',gap:10,
    alignItems:'center',
    '& .info':{
      display:'flex',
      flexDirection:'column',
      '& .name':{
        fontWeight:600,
        fontSize:14
      },
      '& .email, .poste':{
          color:'grey',
          fontSize:13,
          fontWeight:500
      }
    }
  },
  avatar:{
    width:32,
    height:32,
    color:'white',
    fontWeight:600,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:'100%',
    fontSize:13,
    '&.light-green':{
      backgroundColor: 'var(--light-green)',
    },
    '&.dark-green':{
      backgroundColor: 'var(--dark-green)',
    },
    '&.orange':{
      backgroundColor: 'var(--orange)',
    },
    '&.bright-orange':{
      backgroundColor:' var(--orange)',
    },

    '&.black':{
      backgroundColor: 'var(--black)',
    },
  },
  verificationMessage:{
    color:'grey',
    width:'70%',
    marginTop:30,
    display:'block',
    margin:'auto',
    textAlign:'center'
  },
  data:{
    margin:0,
    fontWeight:500,
    fontSize:16,
    '& .chip':{
      marginRight:10,
      fontWeight:600,
    },
    '&.disabled':{
      color:'grey',
      fontSize:13
    }
  },
  projectChoice:{
    width:'100%',
    borderRadius:10,
    backgroundColor:'unset',
    textAlign:'left',
    margin:'5px 0 ',
    height:70,
    border:'1px solid lightgrey',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    padding:'10px 20px',
    transition:'all  0.3s ease-in-out',
    '& .bold':{
     fontWeight:600,
     fontSize:14,
     color:'var(--black)'
    },
    fontSize:13,
    color:'darkgrey',
    '&:hover':{
     backgroundColor:'var(--pastel-green)'
    },
    '&[disabled]':{
      '& .bold':{
        color:'grey',
      },
      '&:hover':{
        backgroundColor:'var(--app-bg)'
       },
    },
  },
  addProjectForm:{
    backgroundColor:'var(--white)',
    padding:'20px 40px ',
    borderRadius:30,
    position:'relative'
  },
  // managerSelect:{
  //   '& .MuiSelect-select':{
  //     padding:11

  //   }
  // }
  hidden:{
    display:'none'
  },
  priorityContainer:{
    justifyContent:'space-evenly'
  },
  priorityFiled:{
    height:30,
    width:30,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    '& button':{
      width:'100%',
      height:'100%',
      border:'none',
      outline:'none',
      borderRadius:'100%',
      '&:hover':{
        opacity:0.7
      },
      '&.active':{
        border:'2px solid var(--black)'

      }
    }
  },
  formSkeleton:{
    width:'100%',
    height:'170px !important'
  }
});
