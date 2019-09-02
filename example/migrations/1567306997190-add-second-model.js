'use strict';

module.exports.up = function (next) {
  console.log('second model added');
  next();
};

module.exports.down = function (next) {
  console.log('second model removed');
  next();
};
