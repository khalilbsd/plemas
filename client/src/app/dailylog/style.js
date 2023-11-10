import { createUseStyles } from "react-jss";

export const dailyLogStyle = createUseStyles({
  dailyLogPage: {
    maxHeight: "100%",
    width: "100%",
    height: "100%"
  },
  card: {
    overflow:'hidden',
    height:'auto',
    backgroundColor: "var(--white)",
    borderRadius: 30,
    padding: 10,
    position:'relative',
    transition: "all 0.3s ease-in-out",

    '&.hidden':{
      padding:0,
      height:0,
      overflowY:'hidden'

    },
    '&.collapsed':{
      padding:10,
      height:'100%',
      overflow:'hidden',
      maxHeight:'calc(100% - 20px )'

    },

  },
  taskList:{
    maxHeight:'85%',
    paddingTop:10,
    height:'auto',
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
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    padding: "15px 30px",
    justifyContent: "space-between",
    border: "1px solid var(--app-bg-color)",
    transition: "all 0.3s ease-in-out",
    marginBottom: 10,

    "&:hover": {
      backgroundColor: "var(--app-bg-color)"
    },
    borderRadius: 20,
    "& .slider": {
      width: "30%"
    },
    '& .project-name, .task-name':{
        minWidth:180,
        fontSize:14,
        // background:'red'
      },
      '& .tache-state':{
      fontSize:14,

    },
    '&.danger':{
      backgroundColor:'#e74c3c2e'
    }
  },
  usersTasks:{
    display:'flex',
    flexDirection:'column',
    gap:10,
    height:'100%'
  },
  joinBtn:{
    background:'none',
    border:'none',
    width:32,
    height:32,
    borderRadius:'100%',
    transition: "all 0.3s ease-in-out",
    '&:hover':{
      backgroundColor:'var(--orange)',
      '& $icon':{
        fill:'white'
      }
    }
  },
  icon: {
    width: 18,
    height: 18,
  },
  sectionHeader:{
    display:'flex',
    gap:20,
    padding:20,
    alignItems:'center'
  },
  datePicker:{
    '& .MuiInputBase-root.MuiOutlinedInput-root':{
      height:40,

    }
  },
  warning:{
    color:'red',
    fontWeight:600,
    fontSize:14,
    marginLeft:5
  }
});
