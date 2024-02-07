/* global React ReactDOM */

const PisteList = require("../../react/components/pistelist.js");

ReactDOM.hydrate(
  React.createElement(PisteList, {
    ...window.data,
    ...window.edwinData,
  }),
  document.getElementById("reactRoot"),
);
