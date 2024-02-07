const pisteSrv = require("../../services/piste.js");
const renderSrv = require("../../services/render.js");
const sessionSrv = require("../../services/session.js");

module.exports = () => ({
  async index(req, res) {
    const data = await sessionSrv.getLast();
    const navbar = renderSrv.navbar(res.locals);
    const content = renderSrv.homepage(data);

    return res.render("generic", {navbar, content, data, components: ["homepage"]});
  },

  async piste(req, res) {
    const pistes = await pisteSrv.getAll();
    const data = {pistes: pistes.rows};
    const navbar = renderSrv.navbar(res.locals);
    const content = renderSrv.pisteList(data);

    return res.render("generic", {navbar, content, data, components: ["pistelist"]});
  },

  session(req, res) {},

  getAddPiste(req, res) {
    const data = {};
    const navbar = renderSrv.navbar(res.locals);
    const content = renderSrv.pisteCreation(res.locals);

    return res.render("generic", {navbar, content, data, components: ["pistecreation"]});
  },

  async postAddPiste(req, res) {
    await pisteSrv.create(req);
  },

  async viewPiste(req, res) {
    const data = await pisteSrv.getById(req.params.id);

    const navbar = renderSrv.navbar(res.locals);
    const content = renderSrv.pisteView(data);

    return res.render("generic", {navbar, content, data, components: ["pisteview"]});
  },
});
