'use strict';

const fs = require('fs');

function FileStore2(path) {
  this.path = path;
}

/**
 * Save the migration data.
 *
 * @api public
 */

FileStore2.prototype.save = function (set, fn) {
  console.log('custom saver...');
  fs.writeFile(this.path, JSON.stringify({
    lastRun: set.lastRun,
    migrations: set.migrations,
  }, null, '  '), fn);
};

/**
 * Load the migration data and call `fn(err, obj)`.
 *
 * @param {Function} fn
 * @return {Type}
 * @api public
 */

FileStore2.prototype.load = function (fn) {
  console.log('custom loader...');
  fs.readFile(this.path, 'utf8', (err, json) => {
    if (err && err.code !== 'ENOENT') return fn(err);
    if (!json || json === '') {
      return fn(null, {});
    }

    let store;
    try {
      store = JSON.parse(json);
      // eslint-disable-next-line no-shadow
    } catch (err) {
      return fn(err);
    }

    // Check if old format and convert if needed
    // eslint-disable-next-line no-prototype-builtins
    if (!store.hasOwnProperty('lastRun') && store.hasOwnProperty('pos')) {
      if (store.pos === 0) {
        store.lastRun = null;
      } else {
        if (store.pos > store.migrations.length) {
          return fn(new Error('Store file contains invalid pos property'));
        }

        store.lastRun = store.migrations[store.pos - 1].title;
      }

      // In-place mutate the migrations in the array
      store.migrations.forEach((migration, index) => {
        if (index < store.pos) {
          // eslint-disable-next-line no-param-reassign
          migration.timestamp = Date.now();
        }
      });
    }

    // Check if does not have required properties
    // eslint-disable-next-line no-prototype-builtins
    if (!store.hasOwnProperty('lastRun') || !store.hasOwnProperty('migrations')) {
      return fn(new Error('Invalid store file'));
    }

    return fn(null, store);
  });
};

module.exports = FileStore2;
