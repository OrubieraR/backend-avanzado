"use strict";

const { Usuario } = require("../models");

// Programado con una clase para facilitar los test unitarios.
class LoginController {
  index(req, res, next) {
    res.locals.error = "";
    res.locals.email = "";
    res.render("login");
  }

  async post(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log((email, password));

      // Buscar usuario en la bbdd.
      const usuario = await Usuario.findOne({ email });

      // Si no existe o si existe y la contraseña no coincide.
      if (!usuario || !(await usuario.comparePassword(password))) {
        // Añadir la siguiente linea cuando esté integrada la internacionalización.
        // res.locals.error = res.__("Credenciales erróneas");
        res.locals.error = "Credenciales erróneas";
        res.locals.email = email;
        res.render("login");
        return;
      }

      // Si lo encuentra y la contraseña coincide ===> Redirección a la zona privada.
      res.redirect("/privado");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LoginController;
