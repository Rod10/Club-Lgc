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
      ["creationDate", "DESC"],
    ],
  });
};

sessionsSrv.create = (data, trainningData) => {
  logger.debug("Create session");
  return Session.create({
    pisteId: data.piste,
    data: trainningData,
  });
};

module.exports = sessionsSrv;
