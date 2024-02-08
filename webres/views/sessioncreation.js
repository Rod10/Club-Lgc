/* global React ReactDOM */

const SessionCreation = require("../../react/components/sessioncreation.js");

ReactDOM.hydrate(
  React.createElement(SessionCreation, {
    ...window.data,
    ...window.edwinData,
  }),
  document.getElementById("reactRoot"),
);
