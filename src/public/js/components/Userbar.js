const React = require("react");
const { useState } = React;
const { MAX_POST_LENGTH } = require("../constants");

const Userbar = ({ username }) => {
  const [textvalue, setTextval] = useState("");

  const handleChange = (event) => {
    setTextval(event.target.value.slice(0, MAX_POST_LENGTH));
  };

  const handleSubmit = (event) => {
    alert("Submit!");
  };

  return (
    <div>
      <h1>Microblog</h1>
      <h2>Hi, {username}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          What do you think?
          <textarea value={textvalue} onChange={handleChange}></textarea>
        </label>
        <input type="submit" value="Publish ->" />
      </form>
      <button>Find someone</button>
    </div>
  );
};

module.exports = Userbar;
