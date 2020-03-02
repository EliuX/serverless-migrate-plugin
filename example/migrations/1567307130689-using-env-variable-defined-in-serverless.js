'use strict';

module.exports.up = function (next) {
  console.log(`do action using DATABASE_NAME=${process.env.DATABASE_NAME}`);
  console.log(`do action using ANOTHER_ENV=${process.env.ANOTHER_ENV}`);
  console.log(`The root folder is ${process.env.SERVERLESS_ROOT_PATH}`);
  console.log(`The complex var is ${process.env.COMPLEX_VAR}`);
  console.log(`The variable BOOLEAN_ENV is ${process.env.BOOLEAN_ENV}`);
  next();
};

module.exports.down = function (next) {
  console.log(`undo action using DATABASE_NAME=${process.env.DATABASE_NAME}`);
  console.log(`undo action using ANOTHER_ENV=${process.env.ANOTHER_ENV}`);
  console.log(`The root folder is ${process.env.SERVERLESS_ROOT_PATH}`);
  console.log(`The complex var is ${process.env.COMPLEX_VAR}`);
  console.log(`The variable BOOLEAN_ENV is ${process.env.BOOLEAN_ENV}`);
  next();
};

module.exports.description = 'Get env variable defined in serverless.yml';
