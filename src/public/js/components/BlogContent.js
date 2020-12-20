const React = require("react");
const { useState } = React;
require("../../css/blogcontent.css");
const { genId } = require("../utils");

const defaultFormValue = (messageSetter, setter) => (e) => {
  e.target.setCustomValidity("");
  messageSetter("");
  setter(e.target.value);
};

const BlogComments = ({ comments }) => {
  const [comment, setComment] = useState("");
  function postComment(event) {
    event.preventDefault();
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

const BlogPost = ({
  post: {
    user: { username },
    content,
    comments,
  },
}) => {
  return (
    <div className="blogcontent__post">
      <p className="blogcontent__post-text" dangerouslySetInnerHTML={{ __html: content }}></p>
      <p className="blogcontent__post-username">{username}</p>
      <BlogComments comments={comments} />
    </div>
  );
};

const BlogContent = ({ posts }) => {
  return (
    <div className="blogcontent">
      {posts.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </div>
  );
};

module.exports = BlogContent;
