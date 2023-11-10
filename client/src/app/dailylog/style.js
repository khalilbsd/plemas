import {createUseStyles} from 'react-jss'


export const dailyLogStyle=createUseStyles({
    dailyLogPage:{
        maxHeight:'100%',
        width:'100%',
        height:'100%'
    },
    card:{
        backgroundColor:'var(--white)',
        borderRadius:30,
        padding:10,
    },
    taskItem:{
        display:'flex',
        alignItems:'center',
        padding:10,
        justifyContent:'space-between',
        border:'1px solid var(--app-bg-color)',
        transition:'all 0.3s ease-in-out',
        '&:hover':{
            backgroundColor:'var(--app-bg-color)',

        },
        borderRadius:20,
        '& .slider':{
            width:'50%'
        }
    }
})