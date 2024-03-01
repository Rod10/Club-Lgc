const moment = require("moment");
const multer = require("multer");
const Config = require("../../../../config.json");

const Storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, (`data/${file.fieldname}`));
  },
  filename(req, file, cb) {
    const timestamp = moment().unix();
    cb(null, `${timestamp}_${file.originalname}`);
  },
});
const upload = multer({storage: Storage});

module.exports = app => {
  const ctrl = app.api.controllers.app;

  app.instance.use("/", (req, res, next) => {
    res.locals.clubName = Config.clubName;
    next();
  });

  app.instance.get("/", ctrl.index);
  app.instance.get("/session/list", ctrl.session);
  app.instance.get("/session/new", ctrl.getAddSession);
  app.instance.post("/session/new", upload.fields([{name: "session", maxCount: 1}]), ctrl.postAddSession);
  app.instance.get("/session/:id/view", ctrl.viewSession);

  app.instance.get("/piste/list", ctrl.piste);
  app.instance.get("/piste/new", ctrl.getAddPiste);
  app.instance.post("/piste/new", upload.fields([{name: "plan", maxCount: 1}]), ctrl.postAddPiste);
  app.instance.get("/piste/:id/view", ctrl.viewPiste);
};
