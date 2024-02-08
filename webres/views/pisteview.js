/* global React ReactDOM */

const PisteView = require("../../react/components/pisteview.js");

ReactDOM.hydrate(
  React.createElement(PisteView, {
    ...window.data,
    ...window.edwinData,
  }),
  document.getElementById("reactRoot"),
);
