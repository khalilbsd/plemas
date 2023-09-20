import { createUseStyles } from "react-jss";


export const styles= createUseStyles({
    uploadContainer:{
        height:400,
        border:'7px dashed #EDC697',
        display:'flex',
        justifyContent:'center',
        margin:'auto',
        transition:'all 0.3s ease-in-out',
        marginBottom:5,
        '&:hover':{
            borderColor:'#EFE7DE'
        }
    },
    btnFileInput:{
        height:60,
        margin:'auto',
        width:150,
        background:'#EDC697',
        color:'white',
        border:'none',
        borderRadius:5
    }
})