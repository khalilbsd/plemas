import logger from '../log/config';
import db from './i2s_midgard.json' with {"type":"json" }






async function runProjectsMigration(){
    try {
        // PROJECTS MIGRATION
        // assumption : for the manager we will be inserting Fadhel for now : it wil be marked as ://TODO
        const projectsTable =  db.filter(table=>table.)

    } catch (error) {
        logger.error(`migration failed: ${error}`)
    }


}








if (db){
    runProjectsMigration()
}else{
    console.log("famech ");
}