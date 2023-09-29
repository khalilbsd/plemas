import { createUseStyles } from "react-jss";


export const styles = createUseStyles({
    resetPasswordPage:{
        height:'100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    box:{
        width:'50%',
        backgroundColor:'white',
        border:'1px solid lightgrey',
        borderRadius:10,
        padding:40,
        textAlign:'center'

    },
    pageTitle:{
        fontSize:24,
        fontWeight:600,
        textAlign:'center'
    },
    text:{
        fontSize:18,
        fontWeight:500,
        marginBottom:30
    }
})