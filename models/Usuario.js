"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Creación esquema
const usuarioSchema = mongoose.Schema({
  // Al añadir unique se crea un índice único que hará que las búsquedas sean más rápidas.
  email: { type: String, unique: true },
  password: String,
});

// Método estático para hashear passwords.
usuarioSchema.statics.hashPassword = function (passwordEnClaro) {
  return bcrypt.hash(passwordEnClaro, 7);
};

// Método de instancia para comparar passwords hasheadas.
usuarioSchema.methods.comparePassword = function (passwordEnClaro) {
  return bcrypt.compare(passwordEnClaro, this.password);
};

// Creación modelo
const Usuario = mongoose.model("Usuario", usuarioSchema);

// Exportación del modelo
module.exports = Usuario;
