"use strict";

const express = require("express");
const createError = require("http-errors");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

const { isAPI } = require("./lib/utils");
const sessionAuth = require("./lib/sessionAuthMiddleware");
const LoginController = require("./routes/loginController");
const PrivadoController = require("./routes/privadoController");
require("./models"); // Connect DB & register models

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/**
 * Global Template variables
 */
app.locals.title = "NodePop";

/**
 * Middlewares
 * Cada petición será evaluada por ellos
 */
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * Website routes
 */
const loginController = new LoginController();
const privadoController = new PrivadoController();

// Middleware de sesiones.
app.use(
  session({
    name: "nodeapp-session",
    secret: "q%CxlZ:SS`Wve~MkH/E>",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 2 }, //Expira a los 2 días de inactividad.
  })
);
app.use("/", require("./routes/index"));
app.use("/anuncios", require("./routes/anuncios"));

// Pasando estilos de controladores.
app.get("/login", loginController.index);
app.post("/login", loginController.post);
app.get("/privado", sessionAuth, privadoController.index);

/**
 * API v1 routes
 */
app.use("/apiv1/anuncios", require("./routes/apiv1/anuncios"));

/**
 * Error handlers
 */
// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err.array) {
    // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req)
      ? { message: "not valid", errors: err.mapped() }
      : `not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  // establezco el status a la respuesta
  err.status = err.status || 500;
  res.status(err.status);

  // si es un 500 lo pinto en el log
  if (err.status && err.status >= 500) console.error(err);

  // si es una petición al API respondo JSON:

  if (isAPI(req)) {
    res.json({ error: err.message });
    return;
  }

  // ...y si no respondo con HTML:

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.render("error");
});

module.exports = app;
