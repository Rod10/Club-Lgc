/* eslint-disable no-magic-numbers */
const path = require("path");
const fs = require("fs");
const {glob} = require("glob");

module.exports = class Router {
  constructor(app) {
    this.app = app;
    this.app.api = {
      controllers: {},
      routes: {},
      models: {},
      middlewares: {},
    };

    // this.loadModels();
    this.loadViews();
    this.loadControllers();
    this.loadRoutes();
    // this.loadMiddlewares();
  }

  loadViews() {
    const root = path.join(__dirname, "../api");
    const views = [];

    fs.readdirSync(root).forEach(file => {
      views.push(path.join(path.join(root, file), "views"));
    });

    this.app.instance.set("views", views);
  }

 // loadModels() {
 //   glob(path.join(__dirname, "../models") + "/**/model.js", {}, (err, files) => {
 //     files.forEach(file => {
 //       let parts = file.split("/");
 //       let name = parts[parts.length - 2];

 //       this.app.api.models[name] = new Datastore({
 //         filename: "bdd/"+name+".db",
 //         autoload: true
 //       });
 //     });
 //   });
 // }

  loadControllers() {
    glob(`${path.join(__dirname, "../api")}/**/controller.js`)
      .then(files => {
        files.forEach(file => {
          // eslint-disable-next-line import/no-dynamic-require,global-require
          const controller = require(file)(this.app);
          const parts = file.split("/");
          const name = parts[parts.length - 2];
          this.app.api.controllers[name] = controller;
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  loadRoutes() {
    // glob(`${path.join(__dirname, "../api")}/**/routes.js`, {}, (err, files) => {
    //   console.log(files);
    //   files.forEach(file => {
    //     const routes = require(file)(this.app);
    //   });
    // });
    glob(`${path.join(__dirname, "../api")}/**/routes.js`)
      .then(files => {
        files.forEach(file => {
          // eslint-disable-next-line import/no-dynamic-require,global-require
          const routes = require(file)(this.app);
          const parts = file.split("/");
          const name = parts[parts.length - 2];
          this.app.api.routes[name] = routes;
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  /* loadMiddlewares() {
        glob(path.join(__dirname, '../middlewares') + '/**.js', {}, (err, files) => {
            files.forEach(file => {
                let middlewares = require(file)(this.app);
                let parts = file.split('/');
                let name = parts[parts.length - 2];
                this.app.api.middlewares[name] = middlewares;
            })
        });
    }*/
};
