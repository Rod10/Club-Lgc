const assert = require("assert");
const logger = require("winston");
const jwt = require("jsonwebtoken");

const tokenSrv = require("../services/token");
const userSrv = require("../services/user");

module.exports = {
  async confirmation(req, res, next) {
    try {
      const token = req.query.token;

      const decoded = tokenSrv.verifyConfirm(token);
      assert(decoded, "Invalid token");
      assert(decoded.id && decoded.email, "Invalid token");
      assert(decoded.type === "user", "Invalid token");
      const user = await userSrv.get(decoded.id);
      req.user = user;
      return next();
    } catch (error) {
      logger.error(error);
    }
  },

  email(req, res, next) {
    Promise.resolve()
      .then(() => {
        const token = req.query.token;
        assert(token, "Missing token");

        const decoded = tokenSrv.verifyOperator(token);
        assert(decoded, "Invalid token");
        assert(decoded.sid && decoded.cid && decoded.oid, "Invalid token");

        return Promise.all([
          societySrv.get(decoded.sid),
          contributorSrv.get(decoded.cid),
          operationSrv.get(decoded.oid),
        ]);
      })
      .then(([society, operator, operation]) => {
        req.society = society;
        req.operator = operator;
        req.operation = operation;

        res.locals = res.locals || {};
        res.locals.operator = operator;
        res.locals.operation = operation;

        next();
      })
      .catch(error => {
        logger.error(error);
        if (error instanceof jwt.TokenExpiredError) {
          res.redirect(303, "/operator/error?expired=true");
        } else {
          res.redirect(303, "/operator/error?confirm=true");
        }
      });
  },

  strict(req, res, next) {
    Promise.resolve()
      .then(() => {
        const token = req.cookies.token;
        assert(token, "Unauthenticate");

        const decoded = tokenSrv.verifyOperator(token);
        assert(decoded, "Unauthenticate");
        assert(decoded.cid && decoded.oid, "Unauthenticate");

        return Promise.all([
          societySrv.get(decoded.sid),
          contributorSrv.get(decoded.cid),
          operationSrv.get(decoded.oid),
        ]);
      })
      .then(([society, operator, operation]) => {
        req.society = society;
        req.operator = operator;
        req.operation = operation;

        res.locals = res.locals || {};
        res.locals.operator = operator;
        res.locals.operation = operation;

        next();
      })
      .catch(error => {
        logger.error(error);

        if (error instanceof jwt.TokenExpiredError) {
          res.redirect(303, "/operator/error?expired=true");
        } else {
          res.redirect(303, "/operator/error");
        }
      });
  },
};
