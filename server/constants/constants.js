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

export const REQUEST_STATE_TREATED  ='treated'
export const REQUEST_STATE_NOON_TREATED  ='not-treated'


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



export const REQUEST_STATES_VALUES=[true,false]
export const REQUEST_STATES_TREATED="traité"
export const REQUEST_STATES_NOT_TREATED="non traité"
export const REQUEST_STATES_LABELS=["traité","non traité"]

export const REQUEST_STATE_TRANSLATION =[
  {
  value:false,
  label:REQUEST_STATES_NOT_TREATED,
},
  {
  value:true,
  label:REQUEST_STATES_TREATED,
},
]


export const ACTION_NAME_PROJECT_CREATION  ="PROJECT_CREATION"
export const ACTION_NAME_TASK_CREATION  ="TASK_CREATION"
export const ACTION_NAME_REQUEST_CREATION  ="REQUEST_CREATION"
export const ACTION_NAME_ADD_INTERVENANTS_BULK  ="ADD_INTERVENANTS_BULK"
export const ACTION_NAME_ADD_INTERVENANT  ="ADD_INTERVENANT"
export const ACTION_NAME_DELETE_INTERVENANT  ="DELETE_INTERVENANT"
export const ACTION_NAME_ADD_PROJECT_MANAGER  ="ADD_PROJECT_MANAGER"
export const ACTION_NAME_CHANGE_PROJECT_MANAGER  ="CHANGE_PROJECT_MANAGER"
export const ACTION_NAME_ASSIGN_PROJECT_MANAGER_HOURS  ="ASSIGN_PROJECT_MANAGER_HOURS"
export const ACTION_NAME_ASSIGN_INTERVENANT_HOURS  ="ASSIGN_INTERVENANT_HOURS"
export const ACTION_NAME_PROJECT_UPDATE  ="PROJECT_UPDATE"
export const ACTION_NAME_TASK_UPDATE  ="TASK_UPDATE"
export const ACTION_NAME_REQUEST_UPDATE  ="REQUEST_UPDATE"
export const ACTION_NAME_VERIFY_TASK  ="VERIFY_TASK"
export const ACTION_NAME_TASK_STATE_CHANGED  ="TASK_STATE_CHANGED"
export const ACTION_NAME_REQUEST_STATE_CHANGED  ="REQUEST_STATE_CHANGED"

export const action_codes =[
  { code:100,action:ACTION_NAME_PROJECT_CREATION,},
  { code:101,action:ACTION_NAME_TASK_CREATION,},
  { code:102,action:ACTION_NAME_REQUEST_CREATION,},
  { code:103,action:ACTION_NAME_ADD_INTERVENANTS_BULK,},
  { code:104,action:ACTION_NAME_ADD_INTERVENANT,},
  { code:105,action:ACTION_NAME_DELETE_INTERVENANT,},
  { code:106,action:ACTION_NAME_ADD_PROJECT_MANAGER,},
  { code:107,action:ACTION_NAME_CHANGE_PROJECT_MANAGER,},
  { code:108,action:ACTION_NAME_ASSIGN_PROJECT_MANAGER_HOURS,},
  { code:109,action:ACTION_NAME_ASSIGN_INTERVENANT_HOURS,},
  { code:110,action:ACTION_NAME_PROJECT_UPDATE,},
  { code:111,action:ACTION_NAME_TASK_UPDATE,},
  { code:112,action:ACTION_NAME_REQUEST_UPDATE,},
  { code:113,action:ACTION_NAME_VERIFY_TASK,},
  { code:114,action:ACTION_NAME_TASK_STATE_CHANGED,},
  { code:115,action:ACTION_NAME_REQUEST_STATE_CHANGED,},
]


export const action_phrases = {
  100: (attributes) => `L'utilisateur ${attributes.email} a créé le projet le ${attributes.action_date}.`,
  101: (attributes) => `L'utilisateur ${attributes.email} a créé une tâche avec l'ID ${attributes.taskID} le ${attributes.action_date}.`,
  102: (attributes) => `L'utilisateur ${attributes.email} a créé une requete avec l'ID ${attributes.requestID} le ${attributes.action_date}.`,
  103: (attributes) => `L'utilisateur ${attributes.email} a ajouté des intervenants en masse le ${attributes.action_date}.`,
  104: (attributes) => `L'utilisateur ${attributes.email} a ajouté un intervenant le ${attributes.action_date}.`,
  105: (attributes) => `L'utilisateur ${attributes.email} a supprimé un intervenant le ${attributes.action_date}.`,
  106: (attributes) => `L'utilisateur ${attributes.email} a ajouté un chef de projet le ${attributes.action_date}.`,
  107: (attributes) => `L'utilisateur ${attributes.email} a changé le chef de projet le ${attributes.action_date}.`,
  108: (attributes) => `L'utilisateur ${attributes.email} a attribué des heures au chef de projet le ${attributes.action_date}.`,
  109: (attributes) => `L'utilisateur ${attributes.email} a attribué des heures à un intervenant le ${attributes.action_date}.`,
  110: (attributes) => `L'utilisateur ${attributes.email} a mis à jour un projet le ${attributes.action_date}.`,
  111: (attributes) => `L'utilisateur ${attributes.email} a mis à jour une tâche avec l'ID ${attributes.taskID} le ${attributes.action_date}.`,
  112: (attributes) => `L'utilisateur ${attributes.email} a mis à jour une requete avec l'ID ${attributes.requestID} le ${attributes.action_date}.`,
  113: (attributes) => `L'utilisateur ${attributes.email} a vérifié une tâche avec l'ID ${attributes.taskID} le ${attributes.action_date}.`,
  114: (attributes) => `L'utilisateur ${attributes.email} a changé l'état d'une tâche avec l'ID ${attributes.taskID} le ${attributes.action_date}.`,
  115: (attributes) => `L'utilisateur ${attributes.email} a changé l'état d'une requete avec l'ID ${attributes.requestID} le ${attributes.action_date}.`,
};






export const actions_messages =[

]




export const actions_list =[
  ACTION_NAME_PROJECT_CREATION,
  ACTION_NAME_TASK_CREATION,
  ACTION_NAME_REQUEST_CREATION,
  ACTION_NAME_ADD_INTERVENANTS_BULK,
  ACTION_NAME_ADD_INTERVENANT,
  ACTION_NAME_DELETE_INTERVENANT,
  ACTION_NAME_ADD_PROJECT_MANAGER,
  ACTION_NAME_CHANGE_PROJECT_MANAGER,
  ACTION_NAME_ASSIGN_PROJECT_MANAGER_HOURS,
  ACTION_NAME_ASSIGN_INTERVENANT_HOURS,
  ACTION_NAME_PROJECT_UPDATE,
  ACTION_NAME_TASK_UPDATE,
  ACTION_NAME_REQUEST_UPDATE,
  ACTION_NAME_VERIFY_TASK,
  ACTION_NAME_TASK_STATE_CHANGED,
  ACTION_NAME_REQUEST_STATE_CHANGED
]



