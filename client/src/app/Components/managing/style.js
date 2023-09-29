import { createUseStyles } from "react-jss";

export const btnStyle=createUseStyles({
    btn:{

    }
})
export const listStyle=createUseStyles({
    modal:{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },
    safeLabel:{
        fontWeight:500,
        fontSize:14,
        backgroundColor:'green',
        borderRadius:10,
        color:'white',
        padding:'0px 20px',
        width:'fit-content',
        // margin:'auto',
        textAlign:'center'


    },
    redLabel:{
        fontWeight:500,
        fontSize:14,
        backgroundColor:'red',
        borderRadius:10,
        color:'white',
        padding:'0px 20px',
        width:'fit-content',
        // margin:'auto',
        textAlign:'center'


    }
})


export const addUserFormStyles=createUseStyles({
    inputs:{
        width:'100%'
    }
})