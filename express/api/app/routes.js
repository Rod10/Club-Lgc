module.exports = app => {
  const ctrl = app.api.controllers.app;
  app.instance.get("/", ctrl.index);
};