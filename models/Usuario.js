"use strict";
const mongoose = require("mongoose");

// Creación esquema
const usuarioSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});

// Creación modelo
const Usuario = mongoose.model("Usuario", usuarioSchema);

// Exportación del modelo
module.exports = Usuario;
