// export const SUPERUSER_ROLE= 'superuser';
// export const EMPLOYEE_ROLE= 'employee';
// export const CLIENT_ROLE= 'client';
export const SUPERUSER_ROLE='superuser'

export const INTERVENANT_ROLE='intervenant '
export const PROJECT_MANAGER_ROLE='Chef_projet'
export const CLIENT_ROLE='client'
export const ALL_ROLES=[
    SUPERUSER_ROLE,
    INTERVENANT_ROLE,
    PROJECT_MANAGER_ROLE,
    CLIENT_ROLE

]





export const FILE_TYPE_PATH ='./uploads/files'
export const IMAGE_TYPE_PATH='./uploads/images'
export const PROJECT_PHASE_STATUS_IN_PROGRESS='in_progress'
export const PROJECT_PHASE_STATUS_BLOCKED='blocked'
export const PROJECT_PHASE_STATUS_COMPLETED='completed'


export const TASK_STATE_DOING = "doing";
export const TASK_STATE_DONE = "done";
export const TASK_STATE_ABANDONED = "abandoned";
export const TASK_STATE_BLOCKED = "blocked";
export const TASK_STATES = [
  TASK_STATE_DOING,
  TASK_STATE_DONE,
  TASK_STATE_ABANDONED,
  TASK_STATE_BLOCKED
];



export const TASK_STATE_TRANSLATION =[
    {
    value:TASK_STATE_DOING,
    label:'En cours',
},
    {
    value:TASK_STATE_DONE,
    label:'Terminé',
},
    {
    value:TASK_STATE_ABANDONED,
    label:'Abandonné',
},
    {
    value:TASK_STATE_BLOCKED,
    label:'Bloqué',
},
]