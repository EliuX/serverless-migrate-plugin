'use strict'

module.exports.up = function (next) {
  console.log(`do action using DATABASE_NAME=${process.env.DATABASE_NAME}`);
  next();
}

module.exports.down = function (next) {
  console.log(`undo action using DATABASE_NAME=${process.env.DATABASE_NAME}`);
  next();
}

module.exports.description = "Get env variable defined in serverless.yml";
