const React = require("react");
require("../../css/blogcontent.css");

const BlogComments = require("./BlogComments");

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
