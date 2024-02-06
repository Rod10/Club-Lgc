/* global React ReactDOM */

const Navbar = require("../../react/components/edwin/newnavbar.js");

ReactDOM.hydrate(
  React.createElement(Navbar, window.edwinData),
  document.getElementById("navbar"),
);
