import {
    STATE_ABANDONED,
    STATE_BLOCKED,
    STATE_DONE,
    STATE_DOING,
    STATE_TODO
  } from "constants/constants";

 enum EState {
    TODO = STATE_TODO,
    DOING = STATE_DOING,
    DONE = STATE_DONE,
    ABANDONED = STATE_ABANDONED,
    BLOCKED = STATE_BLOCKED
  }


  export default EState