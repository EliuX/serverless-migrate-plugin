'use strict'

module.exports.up = function (next) {
  console.log("Adding new model");
  next()
}

module.exports.down = function (next) {
  console.log("Removing new model");
  next()
}

module.exports.description = "First migration";
