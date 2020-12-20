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
      body: JSON.stringify({ firstId: posts[0].id, lastId: posts[posts.length - 1].id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts.concat(...posts));
      });
  }
  postPoll = setTimeout(() => getNewPosts(posts, setPosts), 5000);
};

const App = () => {
  const [user, setUser] = useState(null);
  getUser(user, setUser);

  const [postLimits, setLimits] = useState({ from: 0, to: 100 });
  const [posts, setPosts] = useState([]);

  getPosts(postLimits, setPosts);

  clearTimeout(postPoll);
  postPoll = setTimeout(() => getNewPosts(posts, setPosts), 5000);
  return (
    <div className="app">
      {user ? <Userbar {...{ user, posts, setPosts }} /> : <div></div>}
      <BlogContent posts={posts} />
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
