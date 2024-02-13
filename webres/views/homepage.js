/* global React ReactDOM */

const HomePage = require("../../react/components/homepage/homepage.js");

ReactDOM.hydrate(
  React.createElement(HomePage, {...window.data}),
  document.getElementById("reactRoot"),
);
