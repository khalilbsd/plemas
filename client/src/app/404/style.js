import { createUseStyles } from "react-jss";



export const styles = createUseStyles({
    pageNotFound:{
        height:'100vh',
        display:'flex'
    },
    box:{
        width:250,
        margin:'auto'
    },
    imageContainer:{
        width:'100%',
        '& img':{
            width:'100%'
        }
    }
})