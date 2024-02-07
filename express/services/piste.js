/* eslint-disable max-lines */
const {Piste} = require("../models/index.js");
const {logger} = require("./logger.js");

const pisteSrv = {};

pisteSrv.getAll = () => {
  logger.debug("Get all pistes");
  return Piste.findAndCountAll({order: [["creationDate", "DESC"]]});
};

pisteSrv.create = data => {
  logger.debug("Create piste");
  return Piste.create({
    dalles: data.body.dalles,
    path: data.file.path,
    tours: 0,
  });
};

module.exports = pisteSrv;
