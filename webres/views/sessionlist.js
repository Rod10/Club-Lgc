/* global React ReactDOM */

const SessionList = require("../../react/components/sessionlist.js");

ReactDOM.hydrate(
  React.createElement(SessionList, {
    ...window.data,
    ...window.edwinData,
  }),
  document.getElementById("reactRoot"),
);
