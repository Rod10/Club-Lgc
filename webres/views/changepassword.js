/* global React ReactDOM */

const ChangePassword = require("../../react/components/changepassword.js");

ReactDOM.hydrate(
  React.createElement(ChangePassword, {
    ...window.data,
    ...window.edwinData,
  }),
  document.getElementById("reactRoot"),
);
