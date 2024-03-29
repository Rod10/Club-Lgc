const cls = require("cls-hooked");
const Sequelize = require("sequelize");

const {logger} = require("../services/logger.js");

const namespace = cls.createNamespace("sequelize-transaction");
Sequelize.useCLS(namespace);

const env = require("../utils/env.js");
const config = require("../utils/config.js").database[env];

const Piste = require("./piste.js");
const Session = require("./session.js");

if (config.logging) {
  config.logging = data => logger.debug(data);
}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    define: {underscored: true},
  },
);

const db = {};

[
  Piste,
  Session,
].forEach(def => {
  const model = def(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;
db.testConnexion = async () => {
  if (!sequelize.close) return "ko";
  try {
    await sequelize.query("select 1 + 1;");
    return "ok";
  } catch {
    return "ko";
  }
};

module.exports = db;
