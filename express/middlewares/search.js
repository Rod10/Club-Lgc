"use strict";

const utils = require("../../react/components/utils");

const defaultLimit = 15;
const defaultPage = 0;

const getPagination = query => {
  let limit = utils.hasProperty(query, "limit")
    ? parseInt(query.limit) || defaultLimit
    : defaultLimit;
  let page = utils.hasProperty(query, "page")
    ? parseInt(query.page) || defaultPage
    : defaultPage;

  return {
    limit: limit < defaultLimit ? defaultLimit : limit,
    page: page < defaultPage ? defaultPage : page,
  };
};

module.exports = {
  manoeuvre: (req, _res, next) => {
    req.parsedQuery = { ...req.query, ...getPagination(req.query) };
    next();
  },

  operation: (req, _res, next) => {
    const q = { ...req.query, ...getPagination(req.query) };

    if (q.notState && !Array.isArray(q.notState)) {
      q.notState = q.notState.split(",");
    }
    req.parsedQuery = q;
    next();
  },

  workOrder: (req, _res, next) => {
    req.parsedQuery = { ...req.query, ...getPagination(req.query) };
    next();
  },

  item: (req, _res, next) => {
    req.parsedQuery = { ...req.query, ...getPagination(req.query) };
    next();
  },
};
