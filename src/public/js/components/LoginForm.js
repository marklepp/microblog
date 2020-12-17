const React = require("react");
const { useState } = React;

const LoginForm = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form method="post" action="/login" className="loginform">
      <input
        className="loginform__field loginform__field--email"
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="loginform__field loginform__field--password"
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input className="loginform__submit" type="submit" value="Login" />
    </form>
  );
};

module.exports = LoginForm;
