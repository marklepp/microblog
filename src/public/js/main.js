const React = require("react");
const ReactDom = require("react-dom");
const { useState } = React;

const { Provider } = require("react-redux");
const store = require("./redux/store");

require("../css/main.css");

const Userbar = require("./components/Userbar");
const BlogContent = require("./components/BlogContent");

const throttle = (limit, func) => {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const debounce = (delay, func) => {
  let inDebounce;
  return function (...args) {
    const context = this;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

const getUser = debounce(50, function getUser(user, setUser) {
  if (user === null) {
    fetch("/user", {
      method: "GET",
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }
});

const getPosts = (function () {
  let values = new WeakSet();
  return function getPosts(limits, setPosts) {
    if (!values.has(limits)) {
      values.add(limits);
      const { from, to } = limits;
      fetch("/posts", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: from, to: to, descending: true }),
      })
        .then((res) => res.json())
        .then((data) => setPosts(data.posts));
    }
  };
})();

let postPoll;

const getNewPosts = function (posts, setPosts) {
  if (posts.length > 0) {
    fetch("/newposts", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postIds: posts.map((p) => p.id) }),
    })
      .then((res) => res.json())
      .then((data) => {
        //let newPosts = data.posts.concat(...posts);
        // if (data.comments.length > 0) {
        //   newPosts = newPosts.map((post) => {
        //     if (data.comments[post.id]) {
        //       post.comments = post.comments.concat(
        //         data.comments[post.id].filter(
        //           (comment) => !post.comments.find((old) => old.id === comment.id)
        //         )
        //       );
        //     }
        //     return post;
        //   });
        // }
        setPosts(data.newPosts.concat(data.posts));
      });
  }
  postPoll = setTimeout(() => getNewPosts(posts, setPosts), 5000);
};

const App = () => {
  const [user, setUser] = useState(null);
  getUser(user, setUser);

  const [postLimits, setLimits] = useState({ from: 0, to: 50 });
  const [posts, setPosts] = useState([]);

  getPosts(postLimits, setPosts);

  clearTimeout(postPoll);
  postPoll = setTimeout(() => getNewPosts(posts, setPosts), 5000);
  return (
    <div className="app">
      {user ? <Userbar {...{ user, posts, setPosts }} /> : <div></div>}
      <BlogContent posts={posts} setPosts={setPosts} />
    </div>
  );
};

ReactDom.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
