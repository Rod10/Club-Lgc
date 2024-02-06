"use strict";

const assert = require("assert");

const tokenSrv = require("../services/token");
const userSrv = require("../services/user");

const {
  ExpectedOptions,
  ExpectedRoles,
  Roles,
  ContributorStates
} = require("../services/constants");

const verifyToken = (req) => Promise.resolve().then(() => {
  const token = req.cookies.token;
  assert(token, "Missing token");
  const decoded = tokenSrv.verifyUser(token);
  assert(decoded, "Invalid token");
  assert(decoded.id && decoded.email && decoded.type, "Invalid token");
  switch(decoded.type) {
  case "user":
    return userSrv.get(decoded.id).then(user => {
      if (user.state !== ContributorStates.ACTIVE) {
        throw new Error("Vous n'êtes pas autorisé à effectuer cette action");
      }
      req.user = user;
    });
  default:
    throw new Error("Invalid token type");
  }
});

module.exports = {
  normal: function (req, res, next) {
    verifyToken(req)
      .then(() => {
        res.locals = res.locals || {};
        res.locals.user = req.user;
        next();
      })
      .catch(error => {
        next();
      });
  },

  strict: function (req, res, next) {
    verifyToken(req)
      .then(() => {
        res.locals = res.locals || {};
        res.locals.user = req.user;
        next();
      })
      .catch(error => {
        console.log(error);
        res.redirect(303, "/");
      });
  },
};

