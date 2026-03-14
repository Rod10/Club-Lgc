const fs = require("fs").promises;
const df = require("dateformat");

const carColors = require("../../constants/carcolors.js").carColors;

const pisteSrv = require("../../services/piste.js");
const renderSrv = require("../../services/render.js");
const sessionSrv = require("../../services/session.js");
const utilsSrv = require("../../services/utils.js");
const {msToDuration, durationToMs} = require("../../services/utils");

const getSessionPage = async (req, res, session) => {
  const formatData = await sessionSrv.formatData(session.id);
  const allSessionsByTrack = await sessionSrv.getAllByTrack(session.piste);
  const bestSession = await sessionSrv.getAllTimeBestSessionsByTrack(allSessionsByTrack);
  const bestSessionFormatData = await sessionSrv.formatData(bestSession.id);

  const data = {
    piste: session?.piste,
    session: formatData,
    bestSession: bestSessionFormatData,
    page: "session",
  };
  const notifs = [];
  for (const transponder of formatData.data) {
    notifs.push({
      body: `${transponder.DisplayName} - ${transponder.Pilot.Nickname}`,
      text: `Tours: ${transponder.totalLaps} - Meilleur Temps: ${transponder.normal.bestLap}`,
    });
  }
  data.notifs = notifs;
  const graphs = {};
  graphs["allLaps"] = {
    type: "pie",
    label: "Nombre de tours total par voiture",
    labels: formatData.data.map(transponder => transponder.DisplayName),
    column: 1,
    backgroundColor: session.transponders.map(transponder => transponder.Uid).map(uid => carColors[uid]),
    data: formatData.data.map(transponder => transponder.totalLaps),
    options: {
      responsive: true,
      maintainAspectRatio: true,
    }
  }
  data.graphs = graphs;
  const navbar = renderSrv.navbar(res.locals);
  const content = renderSrv.homepage(data);
  return res.render("generic", {navbar, content, data, components: ["homepage"]});
}

// eslint-disable-next-line max-lines-per-function
module.exports = () => ({
  async index(req, res) {
    const lastSession = await sessionSrv.getLast();
    return getSessionPage(req, res, lastSession);
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
    const track = await pisteSrv.getById(req.params.id);
    const sessions = await sessionSrv.getAllByTrack(track);
    const bestSession = await sessionSrv.getAllTimeBestSessionsByTrack(sessions);
    const bestSessionFormatData = await sessionSrv.formatData(bestSession.id);

    const sessionsData = {
      ms: {
        bestLap: null,
        totalDrivingTime: null,
        averageLap: null,
      },
      normal: {
        bestLap: null,
        totalDrivingTime: null,
        averageLap: null,
      },
      best: {
        transponder: {},
        lap: {},
      },
      data: [],
      totalLaps: 0,
    };

    const laps = [];
    for (const session of sessions.rows) {
      for (const sessionLap of session.laps) {
        laps.push({
          ...sessionLap,
          msDuration: utilsSrv.durationToMs(sessionLap.Duration),
          sessionId: session.id,
        });
      }
    }
    laps.sort((a, b) => a.msDuration - b.msDuration)

    let transponders = [];
    for (const session of sessions.rows) {
      for (const transponder of session.transponders) {
        if (!transponders.find(t => transponder.Id === t.Id)) {
          transponders.push(transponder);
        }
      }
    }

    sessionsData.totalLaps = laps.length;
    sessionsData.ms.bestLap = laps[0];
    sessionsData.ms.totalDrivingTime = laps.reduce((accumulator, currentValue) => accumulator + currentValue.msDuration, 0);
    sessionsData.ms.averageLap = Math.round(sessionsData.ms.totalDrivingTime / sessionsData.totalLaps);
    sessionsData.normal.bestLap = msToDuration(sessionsData.ms.bestLap.msDuration);
    sessionsData.normal.totalDrivingTime = msToDuration(sessionsData.ms.totalDrivingTime);
    sessionsData.normal.averageLap = msToDuration(sessionsData.ms.averageLap);
    sessionsData.best.lap = laps.find(lap => lap.Id === laps[0].Id);
    sessionsData.best.transponder = transponders.find(transponder => transponder.Id === sessionsData.best.lap.TransponderId);

    for (const transponder of transponders) {
      const transponderData = transponder;
      transponderData.laps = laps.filter(lap => lap.TransponderId === transponder.Id);
      transponder.totalLaps = transponderData.laps.length;
      transponderData.ms = {};
      transponderData.normal = {};
      transponderData.ms.bestLap = transponderData.laps[0];
      transponderData.ms.totalDrivingTime = transponderData.laps.reduce((accumulator, currentValue) => accumulator + currentValue.msDuration, 0);
      transponderData.ms.averageLap = Math.round(transponderData.ms.totalDrivingTime / transponder.totalLaps);
      transponderData.normal.bestLap = msToDuration(transponderData.ms.bestLap.msDuration);
      transponderData.normal.totalDrivingTime = msToDuration(transponderData.ms.totalDrivingTime);
      transponderData.normal.averageLap = msToDuration(transponderData.ms.averageLap);
      sessionsData.data.push(transponderData)
    }

    const data = {
      piste: track,
      session: sessionsData,
      bestSession: bestSessionFormatData,
      page: "track"
    };

    const notifs = [];
    for (const session of sessions.rows) {
      const sessionFormatData = await sessionSrv.formatData(session.id);
      notifs.push({
        body: `${df(new Date(sessionFormatData.date), "dd/mm/yyyy")}`,
        text: `Tours: ${sessionFormatData.totalLaps} - Meilleur Temps: ${sessionFormatData.best.lap.Duration} par ${sessionFormatData.best.transponder.Pilot.Nickname}`,
      });
    }
    data.notifs = notifs;
    const graphs = {};
    graphs["allLaps"] = {
      type: "pie",
      label: "Nombre de tours total par voiture",
      labels: sessionsData.data.map(transponder => transponder.DisplayName),
      column: 1,
      backgroundColor: transponders.map(transponder => transponder.Uid).map(uid => carColors[uid]),
      data: sessionsData.data.map(transponder => transponder.totalLaps),
      options: {
        responsive: true,
        maintainAspectRatio: true,
      }
    }

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
    const exportFileName = req.files["session"][0].filename;
    const data = await fs.readFile(`data/session/${exportFileName}`, "utf-8");
    const sessionDataJson = JSON.parse(data.toString());
    sessionDataJson.pisteId = req.body.piste;
    const session = await sessionSrv.create(sessionDataJson);
    const piste = await pisteSrv.getById(req.body.piste);
    const sessionData = await sessionSrv.formatData(session.id);
    piste.tours += sessionData.totalLaps;
    piste.save();
    res.redirect("/session/list");
  },

  async viewSession(req, res) {
    const session = await sessionSrv.getById(req.params.id);
    return getSessionPage(req, res, session);
  },
});
