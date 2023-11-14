export const NOTIFY_SUCCESS = "success";
export const NOTIFY_ERROR = "error";
export const NOTIFY_INFO = "info";
export const TASK_STATE_DOING = "En cours";
export const TASK_STATE_DONE = "Terminé";
export const TASK_STATE_ABANDONED = "Abandonné";
export const TASK_STATE_BLOCKED = "Bloqué";
export const TASK_STATES = [
  TASK_STATE_DOING,
  TASK_STATE_DONE,
  TASK_STATE_ABANDONED,
  TASK_STATE_BLOCKED
];


export const TASK_STATE_TRANSLATION =[
  {
  label:"doing",
  value:TASK_STATE_DOING,
},
  {
  label:'done',
  value:TASK_STATE_DONE,
},
  {
  label:'abandoned',
  value:TASK_STATE_ABANDONED,
},
  {
  label:'blocked',
  value:TASK_STATE_BLOCKED,
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

