/* eslint-disable max-lines */
const {Session} = require("../models/index.js");
const {logger} = require("./logger.js");

const sessionsSrv = {};

sessionsSrv.getAll = () => {
  logger.debug("Get all sessions");
  return Session.findAndCountAll();
};
sessionsSrv.getById = id => {
  logger.debug("Get sessions by id=[%s]", id);
  return Session.findOne({
    where: {id},
    include: [
      {association: Session.Piste},
    ],
  });
};

sessionsSrv.getLast = () => {
  logger.debug("Get last session");
  return Session.findOne({
    include: [
      {association: Session.Piste},
    ],
    order: [
      ["sessionDate", "DESC"],
    ],
  });
};

/**
 *
 * @param {object} data
 * @param {int} data.pisteId
 * @param {object} data.data
 * @returns {*}
 */
sessionsSrv.create = (data) => {
  logger.debug("Create session");
  return Session.create({
    pisteId: data.pisteId,
    session: data.Session,
    transponders: data.Transponders,
    laps: data.Laps,
    sessionDate: data.Session.CreationDate,
  });
};

const durationToMs = duration => {
  const match = duration.match(/^(\d+):(\d+):(\d+(?:\.\d+)?)$/);
  if (!match) throw new Error("Invalid duration format");

  const [, h, m, s] = match;

  return (
      Number(h) * 3600000 +
      Number(m) * 60000 +
      Math.round(Number(s) * 1000)
  );
}

const msToDuration = ms => {
  const hours = Math.floor(ms / 3600000);
  ms %= 3600000;

  const minutes = Math.floor(ms / 60000);
  ms %= 60000;

  const seconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  const fraction = String(milliseconds).padStart(3, "0") + "0000";

  return `${hh}:${mm}:${ss}.${fraction}`;
}

sessionsSrv.formatData = async sessionId => {
  logger.debug("Format data of session=[%s] for better viewing", sessionId);
  const session = await sessionsSrv.getById(sessionId);
  /*
    sessionData = [
      {
        "Id": 20,
        "Uid": 25479,
        "DisplayName": "25479",
        "Pilot": {
          "Id": 1,
          "Nickname": "Mystery man",
          "IsBuiltIn": true
        },
        "Laps": [...],
        "TotalLaps": XXX,
        "BestLap": "00:00:09.7670000",
        "AverageLap": "00:00:09.7670000",
        "TotalDrivingTime": "
      },
    ]
   */
  const sessionData = {
    date: session.sessionDate,
    ms: {},
    normal: {},
    best: {
      transponder: {},
      lap: {},
    },
    data: [],
    totalLaps: 0,
  };

  const sessionLaps = session.laps.map(a => ({id: a.Id, duration: durationToMs(a.Duration)})).sort((a, b) => a.duration - b.duration);
  sessionData.totalLaps = sessionLaps.length;
  sessionData.ms.bestLap = sessionLaps[0];
  sessionData.ms.totalDrivingTime = sessionLaps.reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0);
  sessionData.ms.averageLap = Math.round(sessionData.ms.totalDrivingTime / sessionData.totalLaps);
  sessionData.normal.bestLap = msToDuration(sessionData.ms.bestLap.duration);
  sessionData.normal.totalDrivingTime = msToDuration(sessionData.ms.totalDrivingTime);
  sessionData.normal.averageLap = msToDuration(sessionData.ms.averageLap);
  sessionData.best.lap = session.laps.find(lap => lap.Id === sessionLaps[0].id);
  sessionData.best.transponder = session.transponders.find(transponder => transponder.Id === sessionData.best.lap.TransponderId);

  for (const transponder of session.transponders) {
    const transponderData = transponder;
    transponderData.laps = session.laps.filter(lap => lap.TransponderId === transponder.Id);
    transponder.totalLaps = transponderData.laps.length;
    const laps = transponder.laps.map(a => durationToMs(a.Duration)).sort((a, b) => a - b);
    transponderData.ms = {};
    transponderData.normal = {};
    transponderData.ms.bestLap = laps[0];
    transponderData.ms.totalDrivingTime = laps.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    transponderData.ms.averageLap = Math.round(transponderData.ms.totalDrivingTime / transponder.totalLaps);
    transponderData.normal.bestLap = msToDuration(transponderData.ms.bestLap);
    transponderData.normal.totalDrivingTime = msToDuration(transponderData.ms.totalDrivingTime);
    transponderData.normal.averageLap = msToDuration(transponderData.ms.averageLap);
    sessionData.data.push(transponderData)
  }

  return sessionData;
}

module.exports = sessionsSrv;
