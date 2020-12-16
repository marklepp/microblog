const React = require("react");
const ReactDom = require("react-dom");
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

ReactDom.render(<App />, document.getElementById("root"));
