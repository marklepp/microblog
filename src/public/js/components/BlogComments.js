const React = require("react");
const { useState, useEffect, useRef } = React;

const { MAX_POST_LENGTH } = require("../constants");
const { defaultFormValue, resizeTextareaToFitContent } = require("../utils");

const updatePost = function (post, posts, setPosts) {
  fetch("/post/id", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId: post.id }),
  }).then((res) => {
    if (res.status === 200) {
      res.json().then((newpost) => {
        let newPosts = [...posts];
        let id = newPosts.findIndex((post) => post.id === newpost.id);
        newPosts[id] = newpost;
        setPosts(newPosts);
      });
    }
  });
};

const BlogComments = ({ comments, post, posts, setPosts }) => {
  const [comment, setComment] = useState("");

  function postComment(event) {
    event.preventDefault();
    if (comment.length > 0) {
      fetch("/comment", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id, content: comment }),
      }).then((res) => {
        if (res.status === 200) {
          setComment("");
          updatePost(post, posts, setPosts);
        }
      });
    }
  }

  const txtarea = useRef(null);

  useEffect(
    function () {
      resizeTextareaToFitContent(txtarea.current);
    },
    [comment]
  );

  return (
    <div className="blogcontent__comments">
      {comments.map(({ id, user: { username }, content }) => (
        <div key={id} className="blogcontent__comment">
          <p
            className="blogcontent__comment-text"
            dangerouslySetInnerHTML={{ __html: content }}
          ></p>
          <p className="blogcontent__comment-username">{username}</p>
        </div>
      ))}
      <form onSubmit={postComment} autoComplete="off" className="blogcontent__commentform">
        <textarea
          ref={txtarea}
          className="blogcontent__commentinput"
          type="text"
          name="content"
          value={comment}
          rows="1"
          onChange={defaultFormValue((value) => setComment(value.slice(0, MAX_POST_LENGTH)))}
          placeholder="Comment"
        ></textarea>
        <input
          type="submit"
          value="Comment"
          className="microblog__button blogcontent__commentsubmit"
        />
      </form>
    </div>
  );
};

module.exports = BlogComments;
