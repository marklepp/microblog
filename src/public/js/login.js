const React = require("react");
const { useState } = React;
const { BrowserRouter, Switch, Route, Link } = require("react-router-dom");
const Router = BrowserRouter;
const ReactDom = require("react-dom");
const { defaultFormValue } = require("./utils");

require("../css/main.css");

//const LoginForm = require("./components/LoginForm");

require("../css/login.css");

const LoginForm = ({ email, setEmail, password, setPassword }) => {
  const [message, setMessage] = useState("");
  function loginUser(event) {
    event.preventDefault();
    fetch("/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status === 200) {
          return window.location.assign("/");
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          const form = document.getElementById("loginform");
          if (data.email) {
            form.elements["email"].setCustomValidity("Email not found");
            setMessage("Email not found");
          } else if (data.password) {
            form.elements["password"].setCustomValidity("Wrong password");
            setMessage("Wrong password");
          } else {
            if (data.errors) {
              data.errors.forEach((err) => {
                form.elements[err.param].setCustomValidity(err.msg);
              });
              setMessage("Check your inputs");
            }
          }
        }
      });
  }

  return (
    <form id="loginform" onSubmit={loginUser} className="loginform">
      <h1 className="microblog__logo">Microblog</h1>
      <input
        className="loginform__field loginform__field--email"
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        required
        autoFocus
        onChange={defaultFormValue(setEmail, setMessage)}
      />
      <input
        className="loginform__field loginform__field--password"
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={defaultFormValue(setPassword, setMessage)}
      />
      {message ? <p className="loginform__message">{message}</p> : <></>}
      <input className="microblog__button loginform__submit" type="submit" value="Login" />
      <Link className="loginform__link" to="/register">
        Not a user? Register
      </Link>
    </form>
  );
};

const RegisterForm = ({ username, setUsername, email, setEmail, password, setPassword }) => {
  const [message, setMessage] = useState("");
  function registerUser(event) {
    event.preventDefault();
    fetch("/register", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((res) => {
        if (res.status === 200) {
          return window.location.assign("/");
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          const form = document.getElementById("registerform");
          if (data.email) {
            form.elements["email"].setCustomValidity("Email already in use");
            setMessage("Email already in use");
          } else {
            if (data.errors) {
              data.errors.forEach((err) => {
                form.elements[err.param].setCustomValidity(err.msg);
              });
              setMessage("Check your inputs");
            }
          }
        }
      });
  }

  const [password2, setPassword2] = useState("");
  return (
    <form id="registerform" onSubmit={registerUser} className="loginform">
      <h1 className="microblog__logo">Microblog</h1>
      <input
        className="loginform__field"
        name="username"
        type="text"
        placeholder="Name"
        value={username}
        required
        autoFocus
        onChange={defaultFormValue(setUsername, setMessage)}
      />
      <input
        className="loginform__field"
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={defaultFormValue(setEmail, setMessage)}
      />
      <input
        className="loginform__field"
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={defaultFormValue(setPassword, setMessage)}
      />
      <input
        className="loginform__field"
        type="password"
        placeholder="Confirm password"
        value={password2}
        required
        onChange={(e) => {
          if (password !== e.target.value) {
            e.target.setCustomValidity("Passwords Don't Match");
            setMessage("Passwords Don't Match");
          } else {
            e.target.setCustomValidity("");
            setMessage("");
          }
          setPassword2(e.target.value);
        }}
      />
      {message ? <p className="loginform__message">{message}</p> : <></>}
      <input className="microblog__button loginform__submit" type="submit" value="Register" />
      <Link className="loginform__link" to="/login">
        Already a user? Login
      </Link>
    </form>
  );
};

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
