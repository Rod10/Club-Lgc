const assert = require("assert");

const {User} = require("../models/index.js");

const passwordSrv = require("./password.js");
const {logger} = require("./logger.js");

const userSrv = {};

userSrv.create = async user => {
  assert(user.username && user.password, "username and password cannot be null");
  return User.create({
    username: user.username,
    password: await passwordSrv.hash(user.password),
  });
};

userSrv.login = async data => {
  assert(data, "Data cannot be null");
  assert(data.username && data.password, "Username and password cannot be empty");

  logger.debug("Authenticate with username=[%s]", data.username);
  const user = await userSrv.getByUsername(data.username);
  /* if (contributor.state !== ContributorStates.ACTIVE) {
    throw new Error("Contributor is not activated or is blocked");
  } */
  const passed = await passwordSrv.compare(data.password, user.password);
  assert(passed, "username and password do not match");
  return user;
};

userSrv.getByUsername = async username => {
  const user = await User.findOne({where: {username}});
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
