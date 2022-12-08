"use strict";
const { Usuario } = require("../models");

class PrivadoController {
  async index(req, res, next) {
    try {
      const usuarioId = req.session.usuarioLogado;
      const usuario = await Usuario.findById(usuarioId);

      if (!usuario) {
        next(new Error("Usuario no encontrado"));
        return;
      }

      res.render("privado", { email: usuario.email });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PrivadoController;
