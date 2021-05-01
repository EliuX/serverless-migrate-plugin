'use strict';

module.exports.up = function (next) {
  // Add your routine to migrate forward
  console.log(`Working on project located in ${process.env.SERVERLESS_ROOT_PATH}`);
  next();
};

module.exports.down = function (next) {
  // Add your routine to migrate backwards
  next();
};
