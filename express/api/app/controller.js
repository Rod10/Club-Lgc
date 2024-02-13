const fs = require("fs").promises;
const df = require("dateformat");
const xml2json = require("@hendt/xml2json");

const pisteSrv = require("../../services/piste.js");
const renderSrv = require("../../services/render.js");
const sessionSrv = require("../../services/session.js");

const graphColor = [
  "#2b4957",
  "#325464",
  "#385f71",
  "#3e6a7e",
  "#45758b",
  "#4b8098",
  "#528ba5",
  "#5d95af",
  "#6a9db5",
  "#77a6bc",
  "#84aec2",
  "#91b7c9",
  "#9ec0cf",
  "#abc8d6",
  "#b8d1dc",
  "#c5d9e3",
  "#d3e2e9",
  "#e0ebf0",
  "#edf3f6",
];

const getRandomInt = () => Math.floor(Math.random() * graphColor.length);

// eslint-disable-next-line max-lines-per-function
module.exports = () => ({
  async index(req, res) {
    const lastSession = await sessionSrv.getLast();
    const data = {
      piste: lastSession?.piste,
      session: lastSession?.data,
      page: "session",
    };

    if (lastSession) {
      data.session.tours = data.session["Trainning"].map(result => parseInt(result.Tour, 10))
        .reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        );

      const notifs = [];
      for (const result of data.session["Trainning"]) {
        notifs.push({
          body: `${result.Pilote}`,
          text: `Tours: ${result.Tour} - Meilleur Temps: ${result.Min}`,
        });
      }
      data.notifs = notifs;

      const graphs = [];
      const pilotes = [];
      const tours = [];

      const sessionData = data.session.Trainning;
      for (const d of sessionData) {
        if (pilotes.includes(d.Pilote)) {
          tours[pilotes.indexOf(d.Pilote)] += parseInt(d.Tour, 10);
        } else {
          pilotes.push(d.Pilote);
          tours[pilotes.indexOf(d.Pilote)] = parseInt(d.Tour, 10);
        }
      }

      graphs.push({
        type: "pie",
        label: "Nombre de tours total par pilote",
        labels: pilotes,
        column: 1,
        backgroundColor: pilotes.map(() => graphColor[getRandomInt()]),
        data: tours,
      });
      data.graphs = graphs;
    }
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
    data.page = "piste";

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
        id: session.id,
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
      backgroundColor: piste.session.map(() => graphColor[getRandomInt()]),
      data: piste.session.map(result => result.data["Trainning"].map(session => parseInt(session.Tour, 10)).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      )),
    });

    const pilotes = [];
    const tours = [];

    for (const session of piste.session) {
      const sessionData = session.data.Trainning;
      for (const d of sessionData) {
        if (pilotes.includes(d.Pilote)) {
          tours[pilotes.indexOf(d.Pilote)] += parseInt(d.Tour, 10);
        } else {
          pilotes.push(d.Pilote);
          tours[pilotes.indexOf(d.Pilote)] = parseInt(d.Tour, 10);
        }
      }
    }

    graphs.push({
      type: "pie",
      label: "Nombre de tours total par pilote",
      labels: pilotes,
      column: 1,
      backgroundColor: pilotes.map(() => graphColor[getRandomInt()]),
      data: tours,
    });

    const datasets = [];
    for (const session of piste.session) {
      const sessionData = session.data.Trainning;
      for (const sd of sessionData) {
        if (datasets.find(d => d.label === sd.Pilote)) {
          datasets.find(d => d.label === sd.Pilote).data.push({y: sd.Min, x: 0});
        } else {
          datasets.push({
            label: sd.Pilote,
            data: [{y: sd.Min, x: 0}],
            borderColor: graphColor[getRandomInt()],
          });
        }
      }
    }
    /* graphs.push({
      type: "line",
      label: "Meilleurs tour par session et par pilote",
      column: 2,
      data: {
        labels: piste.session.map(result => df(result.creationDate, "dd/mm/yyyy")),
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {position: "top"},
          title: {
            display: true,
            text: "Pilotes",
          },
        },
        scales: {
          y: {
            type: "time",
            time: {
              parser: "HH:mm:ss",
              unit: "seconds",
              tooltipFormat: "HH:mm:ss",
              displayFormats: {"seconds": "HH:mm:ss"},
              unitStepSize: 30,
            },
          },
        },
        elements: {line: {tension: 0.5}},
      },
    }); */
    data.graphs = graphs;

    const navbar = renderSrv.navbar(res.locals);
    const content = renderSrv.homepage(data);

    return res.render("generic", {navbar, content, data, components: ["homepage"]});
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

  async viewSession(req, res) {
    const lastSession = await sessionSrv.getById(req.params.id);

    const data = {
      piste: lastSession.piste,
      session: lastSession.data,
      page: "session",
    };

    data.session.tours = data.session["Trainning"].map(result => parseInt(result.Tour, 10)).reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );

    const notifs = [];
    for (const result of data.session["Trainning"]) {
      notifs.push({
        body: `${result.Pilote}`,
        text: `Tours: ${result.Tour} - Meilleur Temps: ${result.Min}`,
      });
    }
    data.notifs = notifs;

    const graphs = [];
    const pilotes = [];
    const tours = [];

    const sessionData = data.session.Trainning;
    for (const d of sessionData) {
      if (pilotes.includes(d.Pilote)) {
        tours[pilotes.indexOf(d.Pilote)] += parseInt(d.Tour, 10);
      } else {
        pilotes.push(d.Pilote);
        tours[pilotes.indexOf(d.Pilote)] = parseInt(d.Tour, 10);
      }
    }

    graphs.push({
      type: "pie",
      label: "Nombre de tours total par pilote",
      labels: pilotes,
      column: 1,
      backgroundColor: pilotes.map(() => graphColor[getRandomInt()]),
      data: tours,
    });
    data.graphs = graphs;

    const navbar = renderSrv.navbar(res.locals);
    const content = renderSrv.homepage(data);

    return res.render("generic", {navbar, content, data, components: ["homepage"]});
  },
});
