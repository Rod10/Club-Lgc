/* eslint-disable max-lines */
const {Session} = require("../models/index.js");
const {logger} = require("./logger.js");
const {durationToMs, msToDuration} = require("./utils.js");

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

sessionsSrv.formatData = async sessionId => {
  logger.debug("Format data of session=[%s] for better viewing", sessionId);
  const session = await sessionsSrv.getById(sessionId);
  const sessionData = {
    date: session.sessionDate,
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

sessionsSrv.getAllByTrack = track => {
  logger.debug("Get all Session by track=[%s]", track.id);

  return Session.findAndCountAll({
    where: {
      pisteId: track.id,
    }
  })
}

sessionsSrv.getAllTimeBestSessionsByTrack = sessions => {
  logger.debug("Get best session by track");

  const laps = [];
  for (const session of sessions.rows) {
    for (const sessionLap of session.laps) {
      laps.push({
        ...sessionLap,
        msDuration: durationToMs(sessionLap.Duration),
        sessionId: session.id,
      });
    }
  }
  laps.sort((a, b) => a.msDuration - b.msDuration);
  return sessions.rows.find(session => session.id === laps[0].sessionId);
}

module.exports = sessionsSrv;
