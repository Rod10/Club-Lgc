/* eslint-disable no-magic-numbers */
const events = require("events");
const path = require("path");
const fs = require("fs");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const favicon = require("serve-favicon");
const logger = require("winston");
const {PUBLIC, PLAN} = require("../utils/paths.js");
const config = require("../config/app.json");
const Router = require("./router.js");
require("winston-daily-rotate-file");

module.exports = class Application {
  constructor() {
    this.bus = new events.EventEmitter();
    this.instance = express();
    // this.mailer = new Mailer(this, emailConfig);
    this.router = new Router(this);
    this.setup();
  }

  // eslint-disable-next-line max-lines-per-function
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

    hbs.registerHelper("log", data => {
      console.log(data);
    });

    hbs.registerHelper("year", () => (new Date().getFullYear()));

    hbs.registerHelper("json", object => object ? JSON.stringify(object) : "null");

    hbs.registerHelper("eq", (v1, v2, options) => {
      if (arguments.length < 3) throw new Error("Handlebar Helper eq needs 2 parameters");
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    /* this.instance.use(function (req,res,next) {
            res.locals.user = typeof req.session.user != 'undefined' ? req.session.user : null;
            next();
        });*/
    this.instance.use(express.static(PUBLIC));
    this.instance.use("/plan", express.static(PLAN));
    this.instance.use("/src", express.static("src"));
    // this.instance.use(favicon(path.join(PUBLIC, "images", "logo.png")));

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
    this.server.listen(3000);
  }
};
