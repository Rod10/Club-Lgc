/* eslint-disable max-lines */
const {Session} = require("../models/index.js");
const {logger} = require("./logger.js");

const sessionsSrv = {};

sessionsSrv.getAll = () => {
  logger.debug("Get all sessions");
  return Session.findAndCountAll();
};

sessionsSrv.getLast = () => {
  logger.debug("Get last session");
  return Session.findOne({order: [["creationDate", "DESC"]]});
};

sessionsSrv.create = (data, trainningData) => {
  logger.debug("Create session");
  return Session.create({
    pisteId: data.piste,
    data: trainningData,
  });
};

module.exports = sessionsSrv;
