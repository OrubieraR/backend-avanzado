"use strict";

const jwt = require("jsonwebtoken");

// Módulo para exportar el middleware.
module.exports = (req, res, next) => {
  // Recoger el jwtoken de la cabecera o de la query string o del body de la petición.
  const jwtToken =
    req.get("Authorization") || req.query.token || req.body.token;

  // Comprobar que el token ha llegado desde el servidor.
  if (!jwtToken) {
    const error = new Error("No token provided");
    error.status = 401;
    next(error);
    return;
  }

  // Comprobar que el token recibido es válido.

  jwt.verify(
    jwtToken,
    // Cambiar para utilizarlo con el process.env.JWT_SECRET
    "alsdkf9osufiourwkejSDFASDfkl",
    (err, payload) => {
      if (err) {
        const error = new Error("No token provided");
        error.status = 401;
        next(error);
        return;
      }
      // Si es valido continuar llamando a next(). En los callback hay que continuar dentro de los callback.
      // En el payload que hay dentro del JWT está el Id del usuario. Nos inventamos el nombre de la propiedad llamando a request (req.).
      req.apiUserId = payload._id;
      next();
    }
  );
};
