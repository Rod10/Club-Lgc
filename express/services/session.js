/* eslint-disable max-lines */
const {Session} = require("../models/index.js");
const {logger} = require("./logger.js");

const sessionsSrv = {};

sessionsSrv.getLast = () => {
  logger.debug("Get last session");
  return Session.findOne({order: [["creationDate", "DESC"]]});
};

module.exports = sessionsSrv;
