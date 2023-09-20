import { createUseStyles } from "react-jss";


export const styles = createUseStyles({

    profileContainer:{
        maxWidth:'100%',
        margin:'auto'
    },
    sizeInfoCard:{
        padding:10
    },
    pageTitle:{
        fontSize:24
    },
    creationDate:{
        fontSize:16,
        color:'lightgrey'
    },
    profileInfo:{
        fontSize:18,
        margin:0,
        fontWeight:400
    },
    profileImage:{
        borderRadius:10
    },
    labels:{
        fontWeight:'bold',
        fontSize:14,
    },
    updateProfile:{
        marginTop:5,
        width:'100%',
        border:'none',
        fontWeight:600,
        fontSize:16,
        height:40,
        borderRadius:5,
        backgroundColor:'#EDC697',
    },
    input:{
        width:'100%'
    }
})