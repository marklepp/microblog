const { combineReducers } = require("redux");
const { RESET } = require("../actionTypes");

//const appReducer = combineReducers({ player, area });

const rootReducer = (state, action) => {
  if (action.type === RESET) {
    state = undefined;
  }

  //return appReducer(state, action);
  return state;
};

module.exports = rootReducer;
