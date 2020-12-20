const React = require("react");
const { useState } = React;
const { Link } = require("react-router-dom");
const { defaultFormValue } = require("../utils");

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

module.exports = RegisterForm;
