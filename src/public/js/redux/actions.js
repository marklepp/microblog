const actions = require("./actionTypes");

module.exports = {
  reset: () => ({ type: actions.RESET, payload: {} }),
};
