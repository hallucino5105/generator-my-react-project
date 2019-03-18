// src/react/reducer/index.tsx

import {combineReducers} from "redux";


// action
enum ActionTypes {
  INITIAL = "@@INITIAL",
}

const initialAction = () => ({
  type: ActionTypes.INITIAL as typeof ActionTypes.INITIAL,
});

type ActionType = (ReturnType<typeof initialAction>)


// state
interface StateType {}
const initialState: StateType = {};


// reducer
const initialReducer = (
  state: StateType = initialState,
  action: ActionType,
) => {
  switch(action.type) {
    default:
      return action;
  }
};

const reducer = combineReducers({
  initial: initialReducer,
});


export default reducer;

