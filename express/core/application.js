const events = require("events");
const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
//  http access logger
const morgan = require("morgan");
const rfs = require("rotating-file-stream");

//  logger
const logger = require("winston");
// const emailConfig = require("../config/mails.json");
const config = require("../config/app.json");
const Router = require("./router.js");
const Mailer = require("./mailer.js");
require("winston-daily-rotate-file");

const favicon = require("serve-favicon");
const {PUBLIC} = require("../utils/paths.js");
const http = require("http");

module.exports = class Application {
  constructor() {
    this.bus = new events.EventEmitter();
    this.instance = express();
    // this.mailer = new Mailer(this, emailConfig);
    this.router = new Router(this);
    this.setup();
  }

  setup() {
    // this.instance.set('trust proxy', 1)
    this.instance.use(session({
      secret: "firebug",
      resave: true,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
      store: new session.MemoryStore(),
    }));

    this.instance.disable("x-powered-by");

    this.instance.use(bodyParser.json());
    this.instance.use(bodyParser.urlencoded({extended: true}));
    this.instance.set("view engine", "hbs");
    //this.instance.set("views", path.join(__dirname, "src/html"));

    // view engine setup
    hbs.registerHelper("section", function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    });
    hbs.registerHelper("log", function(data) {
      console.log(data);
    });

    hbs.registerHelper("year", () => (new Date().getFullYear()));

    hbs.registerHelper("json", object => object ? JSON.stringify(object) : "null");

    hbs.registerHelper("eq", function(v1, v2, options) {
      if (arguments.length < 3) throw new Error("Handlebar Helper eq needs 2 parameters");
      if (v1 == v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    /* this.instance.use(function (req,res,next) {
            res.locals.user = typeof req.session.user != 'undefined' ? req.session.user : null;
            next();
        });*/
    this.instance.use(express.static(PUBLIC));
    this.instance.use("/src", express.static("src"));
    // this.instance.use(favicon(path.join(PUBLIC, "images", "blackspirit.png")));

    this.instance.use(cookieParser());

    //  setup loggers
    const logDirectory = path.join(__dirname, "../logs");
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
    //  create a rotating write stream
    const accessLogStream = rfs.createStream("access.log", {
      interval: "1d",
      path: logDirectory,
      maxFiles: 30,
    });

    this.instance.use(morgan("combined", {stream: accessLogStream}));

    const transport = new logger.transports.DailyRotateFile({
      dirname: logDirectory,
      filename: "winston-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      maxFiles: "30d",
    });

    logger.configure({
      transports: [transport],
      exitOnError: false,
    });

    this.server = http.createServer(this.instance);
  }

  start() {
    this.server.listen(config.local.port);
  }
};
