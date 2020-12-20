const React = require("react");
const { useState } = React;
const { MAX_POST_LENGTH } = require("../constants");

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

module.exports = PostForm;
