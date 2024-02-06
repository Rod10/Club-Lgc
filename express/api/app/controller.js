const renderSrv = require("../../services/render.js");
const sessionSrv = require("../../services/session.js");

module.exports = () => ({
  async index(req, res) {
    const data = await sessionSrv.getLast();
    console.log(data);
    const navbar = renderSrv.navbar(res.locals);
    const content = renderSrv.homepage(data);

    return res.render("generic", {navbar, content, data, components: ["homepage"]});
  },

  piste(req, res) {},

  session(req, res) {},
});
