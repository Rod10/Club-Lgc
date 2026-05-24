const fs = require("fs").promises;
const df = require("dateformat");

const carColors = require("../../constants/carcolors.js").carColors;

const cookieOptions = require("../../services/cookie.js");
const pisteSrv = require("../../services/piste.js");
const renderSrv = require("../../services/render.js");
const sessionSrv = require("../../services/session.js");
const tokenSrv = require("../../services/token.js");
const utilsSrv = require("../../services/utils.js");
const userSrv = require("../../services/user.js");
const {msToDuration} = require("../../services/utils.js");
const {SEE_OTHER} = require("../../utils/error.js");

const getSessionPage = async (req, res, session) => {
  const notifs = [];
  const graphs = {};
  let data = {
    page: "session",
    notifs,
    graphs,
  };

  if (session) {
    const formatData = await sessionSrv.formatData(session.id);
    const allSessionsByTrack = await sessionSrv.getAllByTrack(session.piste);
    const bestSession = await sessionSrv.getAllTimeBestSessionsByTrack(allSessionsByTrack);
    const bestSessionFormatData = await sessionSrv.formatData(bestSession.id);

    data = {
      piste: session?.piste,
      session: formatData,
      bestSession: bestSessionFormatData,
      page: "session",
    };
    for (const transponder of formatData.data) {
      notifs.push({
        body: `${transponder.DisplayName} - ${transponder.Pilot.Nickname}`,
        text: `Tours: ${transponder.totalLaps} - Meilleur Temps: ${transponder.normal.bestLap}`,
        carId: transponder.Id,
      });
    }
    data.notifs = notifs;
    graphs["allLaps"] = {
      type: "pie",
      label: "Nombre de tours total par voiture",
      labels: formatData.data.map(transponder => transponder.DisplayName),
      column: 1,
      backgroundColor: session.transponders
        .map(transponder => transponder.Uid)
        .map(uid => carColors[uid]),
      data: formatData.data.map(transponder => transponder.totalLaps),
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
    };
    data.graphs = graphs;
  }
  const navbar = renderSrv.navbar(res.locals);
  const content = renderSrv.homepage(data);
  return res.render("generic", {navbar, content, data, components: ["homepage"]});
};

// eslint-disable-next-line max-lines-per-function
module.exports = () => ({
  getLogin(req, res, next) {
    try {
      const query = new URLSearchParams(req.query).toString();
      const data = renderSrv.userLogin({
        passwordChanged: req.query.passwordChanged === "true",
        query: query ? `?${query}` : "",
      });

      return res.render("login_society", {data});
    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  async postLogin(req, res, next) {
    try {
      const user = await userSrv.login(req.body);
      const token = tokenSrv.user(user);
      res.cookie("token", token, cookieOptions);
      if (user.needPasswordChange) {
        res.redirect(SEE_OTHER, "/change-password");
      } else {
        res.redirect(SEE_OTHER, "/");
      }
    } catch (e) {
      console.log(e);

      const query = new URLSearchParams(req.query).toString();
      const data = renderSrv.userLogin({
        error: true,
        username: req.body.username,
        query: query ? `?${query}` : "",
      });
      res.render("login_society", {data});
    }
  },

  getLogout(req, res, next) {
    res.cookie("token", "", {expires: new Date()});
    res.redirect(SEE_OTHER, "/");
  },

  getChangePassword(req, res, next) {
    const data = {user: req.user};
    const content = renderSrv.changePassword(data);

    return res.render("generic", {content, data, components: ["changepassword"]});
  },

  async postChangePassword(req, res, next) {
    await userSrv.changePassword(req.body);
    res.cookie("token", "", {expires: new Date()});
    res.redirect(SEE_OTHER, "/");
  },

  async index(req, res) {
    if (req.user.needPasswordChange) {
      return res.redirect(SEE_OTHER, "/change-password");
    }
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
        if (!sessionLap.Discarded) {
          laps.push({
            ...sessionLap,
            msDuration: utilsSrv.durationToMs(sessionLap.Duration),
            sessionId: session.id,
          });
        }
      }
    }
    laps.sort((a, b) => a.msDuration - b.msDuration);

    const transponders = [];
    const rawTransponders = [];
    for (const session of sessions.rows) {
      for (const sessionTransponder of session.transponders) {
        if (!transponders.find(t => sessionTransponder.Uid === t.uId)) {
          transponders.push({
            uId: sessionTransponder.Uid,
            displayName: sessionTransponder.DisplayName,
            id: [sessionTransponder.Id],
            pilots: [sessionTransponder.Pilot],
          });
          rawTransponders.push(sessionTransponder);
        } else {
          const transponder = transponders.find(t => sessionTransponder.Uid === t.uId);
          transponder.id.push(sessionTransponder.Id);
          if (!transponder.pilots.find(pilot => pilot.Id === sessionTransponder.Pilot.Id)) {
            transponder.pilots.push(sessionTransponder.Pilot);
          }
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
    sessionsData.best.transponder = rawTransponders.find(rawTransponder => rawTransponder.Id === sessionsData.best.lap.TransponderId);

    for (const transponder of transponders) {
      const transponderData = transponder;
      transponderData.laps = laps.filter(lap => transponder.id.includes(lap.TransponderId));
      transponder.totalLaps = transponderData.laps.length;
      transponderData.ms = {};
      transponderData.normal = {};
      transponderData.ms.bestLap = transponderData.laps[0];
      transponderData.ms.totalDrivingTime = transponderData.laps.reduce((accumulator, currentValue) => accumulator + currentValue.msDuration, 0);
      transponderData.ms.averageLap = Math.round(transponderData.ms.totalDrivingTime / transponder.totalLaps);
      transponderData.normal.bestLap = msToDuration(transponderData.ms.bestLap);
      transponderData.normal.totalDrivingTime = msToDuration(transponderData.ms.totalDrivingTime);
      transponderData.normal.averageLap = msToDuration(transponderData.ms.averageLap);
      sessionsData.data.push(transponderData);
    }

    const data = {
      piste: track,
      session: sessionsData,
      bestSession: bestSessionFormatData,
      page: "track",
    };

    const notifs = [];
    for (const session of sessions.rows) {
      const sessionFormatData = await sessionSrv.formatData(session.id);
      notifs.push({
        body: `${df(new Date(sessionFormatData.date), "dd/mm/yyyy")}`,
        text: `Tours: ${sessionFormatData.totalLaps} - Meilleur Temps: ${sessionFormatData.best.lap.Duration} par ${sessionFormatData.best.transponder.Pilot.Nickname}`,
        id: session.id,
      });
    }
    data.notifs = notifs;
    const graphs = {};
    graphs["allLaps"] = {
      type: "pie",
      label: "Nombre de tours total par voiture",
      labels: transponders.map(transponder => transponder.displayName),
      column: 1,
      backgroundColor: transponders.map(transponder => transponder.uId).map(uid => carColors[uid]),
      data: sessionsData.data.map(transponder => transponder.totalLaps),
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
    };
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
