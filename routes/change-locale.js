"use strict";
const express = require("express");
const router = express.Router();

router.get("/:locale", (req, res, next) => {
  const locale = req.params.locale;
  //   res.send("Petición para cambiar a " + locale);

  // Cookie en la respuesta que indique el nuevo locale. (La leerá gracias al app.use(i18n.init) de app.js)
  res.cookie("nodeapp-locale", locale, { maxAge: 1000 * 60 * 60 * 24 * 30 }); // 1 mes.

  // Responder con una redirección a la misma página de donde se hizo la petición.
  res.redirect(req.get("Referer"));
});

module.exports = router;
