const { RESET } = require("./actionTypes");

module.exports = {
  reset: () => ({ type: RESET, payload: {} }),
};
