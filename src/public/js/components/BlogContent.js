const React = require("react");
const { useState } = React;
require("../../css/blogcontent.css");
const { genId } = require("../utils");

const defaultFormValue = (messageSetter, setter) => (e) => {
  e.target.setCustomValidity("");
  messageSetter("");
  setter(e.target.value);
};

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
      <form onSubmit={postComment} className="blogcontent__commentform">
        <input
          className="blogcontent__commentinput"
          type="text"
          name="content"
          value={comment}
          onChange={defaultFormValue(() => {}, setComment)}
          placeholder="Comment"
        />
        <input
          type="submit"
          value="Comment"
          className="microblog__button blogcontent__commentsubmit"
        />
      </form>
    </div>
  );
};

const BlogPost = (props) => {
  const {
    post: {
      user: { username },
      content,
      comments,
    },
  } = props;
  return (
    <div className="blogcontent__post">
      <p className="blogcontent__post-text" dangerouslySetInnerHTML={{ __html: content }}></p>
      <p className="blogcontent__post-username">{username}</p>
      <BlogComments comments={comments} {...props} />
    </div>
  );
};

const BlogContent = (props) => {
  const { posts } = props;
  return (
    <div className="blogcontent">
      {posts.map((post) => (
        <BlogPost key={post.id} post={post} {...props} />
      ))}
    </div>
  );
};

module.exports = BlogContent;
