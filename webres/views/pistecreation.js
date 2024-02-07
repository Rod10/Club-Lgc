/* global React ReactDOM */

const PisteCreation = require("../../react/components/pistecreation.js");

ReactDOM.hydrate(
  React.createElement(PisteCreation, {
    ...window.data,
    ...window.edwinData,
  }),
  document.getElementById("reactRoot"),
);
