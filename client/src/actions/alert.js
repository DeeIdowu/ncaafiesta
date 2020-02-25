import uuid from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

//via thunk
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
  //generate the id:
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });
  //to remove the alert
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
