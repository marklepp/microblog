const React = require("react");
const ReactDom = require("react-dom");

const { Provider } = require("react-redux");
const store = require("./redux/store");

require("../css/main.css");

const Userbar = require("./components/Userbar");
const BlogContent = require("./components/BlogContent");

const App = () => {
  return (
    <div className="app">
      <Userbar user={{ id: "asdf", username: "John Doe" }} />
      <BlogContent />
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
