const React = require("react");
const { useState } = React;
const { BrowserRouter, Switch, Route } = require("react-router-dom");
const Router = BrowserRouter;
const ReactDom = require("react-dom");

require("../css/main.css");

require("../css/login.css");

const LoginForm = require("./components/LoginForm");
const RegisterForm = require("./components/RegisterForm");

const App = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginstate = { username, setUsername, email, setEmail, password, setPassword };
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/login">
            <LoginForm {...loginstate} />
          </Route>
          <Route path="/register">
            <RegisterForm {...loginstate} />
          </Route>
          <Route path="/">
            <LoginForm {...loginstate} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

ReactDom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
