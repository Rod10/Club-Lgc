const React = require("react");
const ReactDOMServer = require("react-dom/server.js");

const NavBar = require("../../react/components/edwin/newnavbar.js");
const HomePage = require("../../react/components/homepage/newhomepage.js");

const renderSrv = [
  {name: "homepage", component: HomePage},
  {name: "navbar", component: NavBar},
].reduce((acc, cur) => {
  acc[cur.name] = props => {
        // this is to reset react-beautiful-dnd context
    if (cur.component.resetServerContext) cur.component.resetServerContext();
    return ReactDOMServer.renderToString(
      React.createElement(cur.component, props),
    );
  };
  return acc;
}, {});

module.exports = renderSrv;
