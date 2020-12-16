const React = require("react");
const { useState, useEffect } = React;
const { MAX_POST_LENGTH } = require("../constants");
require("../../css/userbar.css");
const { mouseDrag } = require("../utils");

const Userbar = ({ username }) => {
  const [textvalue, setTextval] = useState("");
  const [bar, setBar] = useState({
    width: "",
    initialWidth: null,
  });
  const [hideBar, setHide] = useState(false);

  const handleChange = (event) => {
    setTextval(event.target.value.slice(0, MAX_POST_LENGTH));
  };

  const handleSubmit = (event) => {
    alert("Submit!");
  };

  const toggleBar = (e) => setHide(!hideBar);

  const resizeUserBar = mouseDrag(0, ".userbar", (userbar, initialPos) => {
    const { left, right } = userbar.getBoundingClientRect();
    const initialWidth = right - left;
    return (e) => {
      let newWidth = initialWidth + (e.clientX - initialPos.x);
      if (newWidth < (bar.initialWidth || initialWidth)) {
        newWidth = bar.initialWidth || initialWidth;
      }
      document.documentElement.style.setProperty(
        "--userbar-width",
        newWidth + "px"
      );
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
        <form className="userbar__form" onSubmit={handleSubmit}>
          <textarea
            className="userbar__thought"
            name="thought"
            value={textvalue}
            onChange={handleChange}
            placeholder="What do you think?"
          ></textarea>
          <input
            type="submit"
            value="Publish ->"
            className="microblog__button userbar__button userbar__button--publish"
          />
        </form>
        <div className="userbar__actions">
          <button className="microblog__button userbar__button userbar__action">
            Find someone
          </button>
        </div>
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
