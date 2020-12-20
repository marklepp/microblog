const React = require("react");
const { useState } = React;
const { Link } = require("react-router-dom");
const { defaultFormValue } = require("../utils");

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

module.exports = LoginForm;
