const { createStore } = require("redux");
const rootReducer = require("./reducers/index");

module.exports = createStore(rootReducer);
