"use strict";

// Módulo que exportará un middleware que comprobará si el usuario está logado.
module.exports = (req, res, next) => {
  if (!req.session.usuarioLogado) {
    res.redirect("/login");
    return;
  }
  next();
};
