const fs = require("fs").promises;
const df = require("dateformat");
const xml2json = require("@hendt/xml2json");

const pisteSrv = require("../../services/piste.js");
const renderSrv = require("../../services/render.js");
const sessionSrv = require("../../services/session.js");

// eslint-disable-next-line max-lines-per-function
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

  async session(req, res) {
    const sessions = await sessionSrv.getAll();
    const data = {sessions: sessions.rows};
    const navbar = renderSrv.navbar(res.locals);
    const content = renderSrv.sessionList(data);

    return res.render("generic", {navbar, content, data, components: ["sessionlist"]});
  },

  getAddPiste(req, res) {
    const data = {};
    const navbar = renderSrv.navbar(res.locals);
    const content = renderSrv.pisteCreation(res.locals);

    return res.render("generic", {navbar, content, data, components: ["pistecreation"]});
  },

  async postAddPiste(req, res) {
    await pisteSrv.create(req);
    res.redirect("/piste/list");
  },

  async viewPiste(req, res) {
    const piste = await pisteSrv.getById(req.params.id);
    const data = {piste};

    const notifs = [];
    for (const session of piste.session) {
      const initialValue = 0;
      const tours = session.data["Trainning"].map(result => parseInt(result.Tour, 10)).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue,
      );
      const temps = session.data["Trainning"].map(result => result.Min);
      temps.sort();
      const meilleurTemps = temps[0];
      notifs.push({
        body: df(session.creationDate, "dd/mm/yyyy"),
        text: `Tours: ${tours} - Meilleur Temps: ${meilleurTemps}`,
      });
    }
    data.notifs = notifs;

    const graphs = [];
    graphs.push({
      type: "pie",
      label: "Nombre de tours par session",
      labels: piste.session.map(result => df(result.creationDate, "dd/mm/yyyy")),
      column: 1,
      backgroundColor: [
        "#385f71",
        "#5b94ae",
        "#92b8c9",
        "#c8dbe4",
      ],
      data: piste.session.map(result => result.data["Trainning"].map(session => session.Tour)),
    });
    data.graps = graphs;

    const navbar = renderSrv.navbar(res.locals);
    const content = renderSrv.pisteView(data);

    return res.render("generic", {navbar, content, data, components: ["pisteview"]});
  },

  async getAddSession(req, res) {
    const pistes = await pisteSrv.getAll();
    const data = {pistes};
    const navbar = renderSrv.navbar(res.locals);
    const content = renderSrv.sessionCreation(data);

    return res.render("generic", {navbar, content, data, components: ["sessioncreation"]});
  },

  async postAddSession(req, res) {
    const trainingFileName = req.files["session"][0].filename;
    const data = await fs.readFile(`data/session/${trainingFileName}`, "binary");
    const json = xml2json.default(data);
    const jsonData = json["WINDEV_TABLE"];
    await sessionSrv.create(req.body, jsonData);
    const piste = await pisteSrv.getById(req.body.piste);
    const initialValue = 0;
    const tours = jsonData["Trainning"].map(result => parseInt(result.Tour, 10)).reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue,
    );
    piste.tours += tours;
    piste.save();
    res.redirect("/session/list");
  },
});
