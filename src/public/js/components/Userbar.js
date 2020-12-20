const React = require("react");
const { useState } = React;
const { MAX_POST_LENGTH } = require("../constants");
require("../../css/userbar.css");
const { mouseDrag } = require("../utils");

const PostForm = ({ user: { id }, posts, setPosts }) => {
  const [textvalue, setTextval] = useState("");

  const handleChange = (event) => {
    setTextval(event.target.value.slice(0, MAX_POST_LENGTH));
  };

  function postNew(event) {
    event.preventDefault();
    if (textvalue.length > 0) {
      fetch("/post", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id, content: textvalue }),
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((newPost) => {
            const newPosts = [newPost, ...posts];
            setPosts(newPosts);
            setTextval("");
          });
        }
      });
    }
  }

  return (
    <form className="userbar__form" onSubmit={postNew}>
      <textarea
        className="userbar__post"
        name="content"
        value={textvalue}
        onChange={handleChange}
        placeholder="What do you think?"
        autoFocus
      ></textarea>
      <input
        type="submit"
        value="Publish ->"
        className="microblog__button userbar__button userbar__button--publish"
      />
    </form>
  );
};

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
      <button className="microblog__button userbar__button userbar__action">Find someone</button>
      <button onClick={logout} className="microblog__button userbar__button userbar__action">
        Logout
      </button>
    </div>
  );
};

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
