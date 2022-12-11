"use strict";

const i18n = require("i18n");
const path = require("path");
const { locales } = require("validator/lib/isIBAN");

i18n.configure({
  locales: ["en", "es"],
  directory: path.join(__dirname, "..", "locales"),
  defaultLocale: "en",
  autoReload: true, // Vigila los cambios que haya en los JSON y los actualiza.
  syncFiles: true, // Sincroniza la información en todos los ficheros de idioma.
  cookie: "nodeapp-locale",
});

// Para utilizar en scripts.
i18n.setLocale("en");

module.exports = i18n;
