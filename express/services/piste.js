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
  const path = `/plan/${data.files["plan"][0].filename}`;
  return Piste.create({
    dalles: data.body.dalles,
    path,
    tours: 0,
  });
};

pisteSrv.getById = id => {
  logger.debug("Get piste with id=[%s]", id);
  return Piste.findOne({
    where: {id},
    include: [
      {association: Piste.Session},
    ],
  });
};

module.exports = pisteSrv;
