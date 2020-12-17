const React = require("react");
const { useState } = React;

require("../../css/login.css");

const LoginForm = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form method="post" action="/login" className="loginform">
      <h1 className="microblog__logo">Microblog</h1>
      <input
        className="loginform__field loginform__field--email"
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        required
        autoFocus
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="loginform__field loginform__field--password"
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="microblog__button loginform__submit"
        type="submit"
        value="Login"
      />
      <a className="loginform__link" href="/register.html">
        Not a user? Register
      </a>
    </form>
  );
};

module.exports = LoginForm;
