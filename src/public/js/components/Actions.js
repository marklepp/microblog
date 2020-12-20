const React = require("react");

const logout = () => {
  fetch("/logout", {
    method: "post",
    body: "",
    credentials: "same-origin",
  }).then((res) => window.location.assign("/"));
};

const Actions = (props) => {
  return (
    <div className="userbar__actions">
      <button onClick={logout} className="microblog__button userbar__button userbar__action">
        Logout
      </button>
    </div>
  );
};

module.exports = Actions;
