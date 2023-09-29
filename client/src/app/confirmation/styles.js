import { createUseStyles } from "react-jss";


export const styles = createUseStyles({

    box:{
        margin:'auto',
        borderRadius:5,
        width:'50%',
        display:'flex',
        flexDirection:'column',
        gap:10
    },
    boxTitle:{
        textAlign:'center',
        fontSize:18,
        fontWeight:500
    },
    inputs:{
        width:'100%'
    },
    saveBtn:{
        width:'100%',
        height:50,

    }
})