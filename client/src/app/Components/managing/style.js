import { createUseStyles } from "react-jss";

export const btnStyle=createUseStyles({
    btn:{
        width:200,
        height:50,
        borderRadius:5,
        color:'var(--white)',
        marginBottom:10,
        border:'none',
        fontFamily:"'MyriadPro', sans-serif !important",
        display:'flex',
        gap:10,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'var(--dark-green)',
        transition:'0.3s all ease-in-out',

        '&:hover':{
            backgroundColor:'var(--light-green)',

        }
    },
    icon:{
        width:28,
        fill:'var(--white)'
    }
})
export const listStyle=createUseStyles({

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
    },
    saveBtn:{
        width:'100%',
        padding:'15px 0',
        color:'var(--white)',
        border:'none',
        borderRadius:5,
        backgroundColor:'var(--dark-green)',
        fontWeight:500,
        textTransform:'capitalize',
        fontFamily:"'MyriadPro', sans-serif !important",
        fontSize:16,
        transition:'0.3s all ease-in-out',
        '&:hover':{
        backgroundColor:'var(--light-green)',

        }
    },
    cancelBtn:{
        width:'100%',
        padding:'15px 0',
        color:'var(--white)',
        border:'none',
        borderRadius:5,
        backgroundColor:'var(--orange)',
        fontWeight:500,
        textTransform:'capitalize',
        fontFamily:"'MyriadPro', sans-serif !important",
        fontSize:16,
        transition:'0.3s all ease-in-out',
        '&:hover':{
            opacity:0.8

            }

    }
})