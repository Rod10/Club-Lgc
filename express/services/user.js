const assert = require("assert");

const {User} = require("../models/index.js");

const passwordSrv = require("./password.js");
const {logger} = require("./logger.js");

const userSrv = {};

userSrv.login = async data => {
  assert(data, "Data cannot be null");
  assert(data.email && data.password, "Email and password cannot be empty");

  logger.debug("Authenticate with email=[%s]", data.email);
  const user = await userSrv.getByEmail(data.email);
  /* if (contributor.state !== ContributorStates.ACTIVE) {
    throw new Error("Contributor is not activated or is blocked");
  } */
  const passed = await passwordSrv.compare(data.password, user.password);
  assert(passed, "Email and password do not match");
  return user;
};

userSrv.getByEmail = async email => {
  const user = await User.findOne({where: {email}});
  assert(user, "Contributor not found");
  return user;
};

userSrv.get = async id => {
  assert(id, "Id cannot be null");
  logger.debug("Get user by id=[%s]", id);
  const user = await User.findOne({where: {id}});
  assert(user, "Contributor not found");
  return user;
};

module.exports = userSrv;
