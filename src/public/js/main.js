const React = require("react");
const ReactDom = require("react-dom");
const { useState } = React;

require("../css/main.css");

const Userbar = require("./components/Userbar");
const BlogContent = require("./components/BlogContent");

const { debounce } = require("./utils");

const getSessionUser = debounce(50, function getSessionUser(user, setUser) {
  if (user === null) {
    fetch("/user", {
      method: "GET",
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }
});

const getPostsBetween = (function () {
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
      body: "", //JSON.stringify({ postIds: posts.map((p) => p.id) }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          if (data) {
            let hasData = false;
            for (let i in data.newPosts) {
              hasData = true;
              break;
            }

            if (hasData) {
              let newPosts = [];
              posts.forEach((post) => {
                if (data.newPosts.hasOwnProperty(post.id)) {
                  newPosts.push(data.newPosts[post.id]);
                  delete data.newPosts[post.id];
                } else {
                  newPosts.push(post);
                }
              });
              setPosts(Object.values(data.newPosts).concat(newPosts));
            }
          }
        });
      }
    });
  }
  postPoll = setTimeout(() => getNewPosts(posts, setPosts), 2000);
};

const App = () => {
  const [user, setUser] = useState(null);
  getSessionUser(user, setUser);

  const [postLimits, setLimits] = useState({ from: 0, to: 50 });
  const [posts, setPosts] = useState([]);

  getPostsBetween(postLimits, setPosts);

  clearTimeout(postPoll);
  postPoll = setTimeout(() => getNewPosts(posts, setPosts), 2000);
  return (
    <div className="app">
      {user ? <Userbar {...{ user, posts, setPosts }} /> : <div></div>}
      <BlogContent posts={posts} setPosts={setPosts} />
    </div>
  );
};

ReactDom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
