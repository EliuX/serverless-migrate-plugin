'use strict';

var migrate = require('migrate');
var dateFormat = require('dateformat');
var program = require('commander');
var chalk = require('chalk');

const DEFAULT_MIGRATION_STORE = '.migrate';

class MigratePlugin {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.provider = this.serverless.getProvider(this.serverless.service.provider.name);

        const commonOptions = {
            store: {
                usage: `Specify the migration states store, e.g. ${DEFAULT_MIGRATION_STORE}`,
                shortcut: 's'
            }
        };

        this.commands = {
            migrate: {
                usage: 'Migrations management for Serverless',
                lifecycleEvents: ['help'],
                commands: {
                    list: {
                        lifecycleEvents: ['setup', 'run'],
                        usage: 'List migrations and their status',
                        options: {
                            ...commonOptions
                        }
                    },
                    up: {
                        lifecycleEvents: ['setup', 'run'],
                        usage: 'Migrates up',
                        options: {
                            ...commonOptions
                        }
                    },
                    down: {
                        lifecycleEvents: ['setup', 'run'],
                        usage: 'Migrates down',
                        options: {
                            ...commonOptions
                        }
                    }
                }
            }
        };

        this.hooks = {
            'migrate:help': this.displayHelp.bind(this),
            'migrate:list:setup': this.setupMigration.bind(this),
            'migrate:list:run': this.runCommand.bind(this, 'list'),
            'migrate:up:setup': this.setupMigration.bind(this),
            'migrate:up:run': this.runCommand.bind(this, 'up'),
            'migrate:down:setup': this.setupMigration.bind(this),
            'migrate:down:run': this.runCommand.bind(this, 'down')
        };

        process.env = this.serverless.service.provider.environment;
    }

    runCommand(cmd) {
        return this.migration.then(this[cmd].bind(this))
            .catch(console.error);
    }

    setupMigration() {
        this.migration = new Promise((resolve, reject) => {
            migrate.load({
                stateStore: this.options.store || DEFAULT_MIGRATION_STORE
            }, (err, set) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(set);
                }
            });
        });
    }

    up(set) {
        set.up(function (err) {
            if (err) {
                throw err;
            }

            console.log(`migration ${chalk.cyan("up")}: completed`);
        });
    }

    down(set) {
        set.down(function (err) {
            if (err) {
                throw err;
            }

            console.log(`migration ${chalk.cyan("down")}: completed`);
        });
    }

    list(set) {
        if (set.migrations.length === 0) {
            console.log('No Migrations were found! Please see run migrate create to add some.');
            process.exit(1);
        }

        set.migrations.forEach(m => console.log(... this.getMigrationStatusData(m, set)));
    }

    getMigrationStatusData(migration, set) {
        const result = [migration.title];

        if (migration.timestamp) {
            result.push(chalk.cyan(`[${dateFormat(migration.timestamp, program.dateFormat)}]`));
        } else {
            result.push(chalk.cyan('[not run]'));
        }

        result.push(migration.description || '<No Description>');

        if (set.lastRun === migration.title) {
            result.push(chalk.green('<==='));
        }

        return result;
    }

    displayHelp() {
        this.serverless.cli.generateCommandsHelp(['migrate']);
    }
}

module.exports = MigratePlugin;