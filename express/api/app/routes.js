const multer = require("multer");

const Storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, ("webres/public/images/plan"));
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({storage: Storage});

module.exports = app => {
  const ctrl = app.api.controllers.app;
  app.instance.get("/", ctrl.index);
  app.instance.get("/piste/list", ctrl.piste);
  app.instance.get("/session/list", ctrl.piste);

  app.instance.get("/piste/new", ctrl.getAddPiste);
  app.instance.post("/piste/new", upload.single("file"), ctrl.postAddPiste);
  app.instance.get("/piste/:id/view", ctrl.viewPiste);
};
