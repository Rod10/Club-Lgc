const React = require("react");
const ReactDOMServer = require("react-dom/server.js");

const NavBar = require("../../react/components/edwin/newnavbar.js");
const HomePage = require("../../react/components/homepage/newhomepage.js");
const PisteList = require("../../react/components/pistelist.js");
const PisteCreation = require("../../react/components/pistecreation.js");
const PisteView = require("../../react/components/pisteview.js");

const renderSrv = [
  {name: "homepage", component: HomePage},
  {name: "navbar", component: NavBar},
  {name: "pisteList", component: PisteList},
  {name: "pisteCreation", component: PisteCreation},
  {name: "pisteView", component: PisteView},
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
