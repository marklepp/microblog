const React = require("react");
const { useState } = React;
const { mouseDrag } = require("../utils");

require("../../css/userbar.css");

const PostForm = require("./PostForm");
const Actions = require("./Actions");

const Userbar = (props) => {
  const { user } = props;
  const { username } = user;
  const [bar, setBar] = useState({
    width: "",
    initialWidth: null,
  });
  const [hideBar, setHide] = useState(false);

  const toggleBar = (e) => setHide(!hideBar);

  const resizeUserBar = mouseDrag(0, ".userbar", (userbar, initialPos) => {
    const { left, right } = userbar.getBoundingClientRect();
    const initialWidth = right - left;
    return (e) => {
      let newWidth = initialWidth + (e.clientX - initialPos.x);
      if (newWidth < (bar.initialWidth || initialWidth)) {
        newWidth = bar.initialWidth || initialWidth;
      }
      document.documentElement.style.setProperty("--userbar-width", newWidth + "px");
      setBar({
        width: newWidth,
        initialWidth: bar.initialWidth || initialWidth,
      });
    };
  });

  return (
    <>
      <div
        className={"userbar".concat(hideBar ? " userbar--hide" : "")}
        style={{ width: bar.width }}
      >
        <h1 className="userbar__logo">Microblog</h1>
        <h2 className="userbar__hello">Hi, {username}</h2>
        <PostForm {...props} />
        <Actions />
        <div className="userbar__resize--bar" onMouseDown={resizeUserBar}></div>
      </div>
      <button
        className={"userbar__menuhide microblog__button userbar__button ".concat(
          hideBar ? "" : "userbar__menuhide--follow-bar"
        )}
        style={{ display: hideBar ? "" : "" }}
        onClick={toggleBar}
      >
        <div className="userbar__menuhide-stripes"></div>
      </button>
    </>
  );
};

module.exports = Userbar;
