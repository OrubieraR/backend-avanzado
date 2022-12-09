"use strict";

const { Usuario } = require("../models");
const jwt = require("jsonwebtoken");

// Programado con una clase para facilitar los test unitarios.
class LoginController {
  index(req, res, next) {
    res.locals.error = "";
    res.locals.email = "";
    res.render("login");
  }

  // Login post desde el website.
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

      // Si lo encuentra y la contraseña coincide.
      // Apuntar en la sessión de usuario (en la memoria del servidor) que es un usuario logado. Se creará una cookie con el identificador de la sesión.
      req.session.usuarioLogado = usuario._id;

      // ===> Redirección a la zona privada.
      res.redirect("/privado");
    } catch (err) {
      next(err);
    }
  }

  logout(req, res, next) {
    // Regenarate reinicia la sesión y la sustituye por una vacía.
    req.session.regenerate((err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect("/");
    });
  }

  // Login post contra el API.
  async postApi(req, res, next) {
    try {
      const { email, password } = req.body;
      // console.log((email, password));

      // Buscar usuario en la bbdd.
      const usuario = await Usuario.findOne({ email });

      // Si no existe o si existe y la contraseña no coincide.
      if (!usuario || !(await usuario.comparePassword(password))) {
        res.status(401);
        res.json({ error: "Credenciales erróneas" });
        return;
      }

      // Si lo encuentra y la contraseña coincide.
      // Generar un token JWT con el _id. Con la librería jsonwebtoken.
      const token = jwt.sign(
        { _id: usuario._id },
        // Ajustar los archivos .env, para que lea las variables de entorno.
        "alsdkf9osufiourwkejSDFASDfkl",
        {
          expiresIn: "2d",
        }
      );

      // ===> Redirección a la zona privada.
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LoginController;
