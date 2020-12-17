const React = require("react");
const ReactDom = require("react-dom");

const { Provider } = require("react-redux");
const store = require("./redux/store");

require("../css/main.css");

const LoginForm = require("./components/LoginForm");

const App = () => {
  return (
    <div className="app">
      <LoginForm />
    </div>
  );
};

ReactDom.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
