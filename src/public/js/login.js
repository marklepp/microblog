const React = require("react");
const { useState } = React;
const { BrowserRouter, Switch, Route, Link } = require("react-router-dom");
const Router = BrowserRouter;
const ReactDom = require("react-dom");

const { Provider } = require("react-redux");
const store = require("./redux/store");

require("../css/main.css");

//const LoginForm = require("./components/LoginForm");

require("../css/login.css");

const defaultFormValue = (setter) => (e) => {
  e.target.setCustomValidity("");
  setter(e.target.value);
};

const LoginForm = ({ email, setEmail, password, setPassword }) => {
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
          } else if (data.password) {
            form.elements["password"].setCustomValidity("Wrong password");
          } else {
            if (data.errors) {
              data.errors.forEach((err) => {
                form.elements[err.param].setCustomValidity(err.msg);
              });
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
        onChange={defaultFormValue(setEmail)}
      />
      <input
        className="loginform__field loginform__field--password"
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={defaultFormValue(setPassword)}
      />
      <input className="microblog__button loginform__submit" type="submit" value="Login" />
      <Link className="loginform__link" to="/register">
        Not a user? Register
      </Link>
    </form>
  );
};

const RegisterForm = ({ username, setUsername, email, setEmail, password, setPassword }) => {
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
          } else {
            if (data.errors) {
              data.errors.forEach((err) => {
                form.elements[err.param].setCustomValidity(err.msg);
              });
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
        onChange={defaultFormValue(setUsername)}
      />
      <input
        className="loginform__field"
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={defaultFormValue(setEmail)}
      />
      <input
        className="loginform__field"
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={defaultFormValue(setPassword)}
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
          } else {
            e.target.setCustomValidity("");
          }
          setPassword2(e.target.value);
        }}
      />
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
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
