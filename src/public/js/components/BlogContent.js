const React = require("react");
require("../../css/blogcontent.css");
const { genId } = require("../utils");

const getTestPosts = () => {
  return [
    {
      id: genId(),
      username: "Some Person",
      content: "meh.",
      comments: [
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
      ],
    },
    {
      id: genId(),
      username: "Some Person",
      content: "meh.",
      comments: [
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
      ],
    },
    {
      id: genId(),
      username: "Some Person",
      content: "meh.",
      comments: [
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
      ],
    },
    {
      id: genId(),
      username: "Some Person",
      content: "meh.",
      comments: [
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
      ],
    },
    {
      id: genId(),
      username: "Some Person",
      content: "meh. here's some more text for you",
      comments: [
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
        {
          id: genId(),
          username: "John Smith",
          content:
            "something lorem ipsum dolor sit amet this is a longer comment for testing how the system will break them",
        },
        { id: genId(), username: "Tom Jones", content: "other" },
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
      ],
    },
    {
      id: genId(),
      username: "Some Person",
      content: "meh.",
      comments: [
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
      ],
    },
    {
      id: genId(),
      username: "Some Person",
      content: "meh.",
      comments: [
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
      ],
    },
    {
      id: genId(),
      username: "Some Person",
      content:
        "something lorem ipsum dolor sit amet this is a longer comment for testing how the system will break themsomething lorem ipsum dolor sit amet this is",
      comments: [
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
      ],
    },
    {
      id: genId(),
      username: "Some Person",
      content: "meh.",
      comments: [
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
      ],
    },
    {
      id: genId(),
      username: "Some Person",
      content: "meh.",
      comments: [
        { id: genId(), username: "John Smith", content: "something" },
        { id: genId(), username: "Tom Jones", content: "other" },
        { id: genId(), username: "Tom Jones", content: "other" },
        { id: genId(), username: "Tom Jones", content: "other" },
        { id: genId(), username: "Tom Jones", content: "other" },
        { id: genId(), username: "Tom Jones", content: "other" },
        { id: genId(), username: "Tom Jones", content: "other" },
      ],
    },
  ];
};

const BlogComments = ({ comments }) => {
  return (
    <div className="blogcontent__comments">
      {comments.map(({ id, username, content }) => (
        <div key={id} className="blogcontent__comment">
          <p className="blogcontent__comment-text">{content}</p>
          <p className="blogcontent__comment-username">{username}</p>
        </div>
      ))}
    </div>
  );
};

const BlogPost = ({ post: { username, content, comments } }) => {
  return (
    <div className="blogcontent__post">
      <p className="blogcontent__post-text">{content}</p>
      <p className="blogcontent__post-username">{username}</p>
      <BlogComments comments={comments} />
    </div>
  );
};

const BlogContent = (props) => {
  const posts = getTestPosts();
  return (
    <div className="blogcontent">
      {posts.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </div>
  );
};

module.exports = BlogContent;
