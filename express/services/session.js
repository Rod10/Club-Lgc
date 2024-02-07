/* eslint-disable max-lines */
const fs = require("fs");
const fsP = require("fs/promises");
const path = require("path");
const util = require("util");
const assert = require("assert");

const moment = require("moment");
const df = require("dateformat");

const {
  Session,
  Op,
  sequelize,
} = require("../models/index.js");
const {logger} = require("./logger.js");

const sessionsSrv = {};

sessionsSrv.getLast = () => {
  logger.debug("Get last session");
  return Session.findOne({order: [["creationDate", "DESC"]]});
};

module.exports = sessionsSrv;
