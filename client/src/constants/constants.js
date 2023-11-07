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