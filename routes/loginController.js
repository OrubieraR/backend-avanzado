"use strict";

// Programado con una clase para facilitar los test unitarios.
class LoginController {
  index(req, res, next) {
    res.render("login");
  }
}

module.exports = LoginController;
