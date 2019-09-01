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
                usage: `The migration states store file you want to use, e.g. ${DEFAULT_MIGRATION_STORE}`,
                shortcut: 's'
            }
        };

        const nameOption = {
            name: {
                usage: 'The migration name you want to move to',
                shortcut: 'n'
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
                            ...commonOptions,
                            ...nameOption
                        }
                    },
                    down: {
                        lifecycleEvents: ['setup', 'run'],
                        usage: 'Migrates down',
                        options: {
                            ...commonOptions,
                            ...nameOption
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
        this.projectConfig = this.serverless.service.custom ? this.serverless.service.custom.migrate: {};
    }

    runCommand(cmd) {
        return this.migration.then(this[cmd].bind(this))
            .catch(console.error);
    }

    setupMigration() {
        this.migration = new Promise((resolve, reject) => {
            migrate.load({
                stateStore: this.options.store || this.projectConfig.store || DEFAULT_MIGRATION_STORE
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
        set.up(this.options.name, function (err) {
            if (err) {
                throw err;
            }

            console.log(`migration ${chalk.cyan("up")}: completed`);
        });
    }

    down(set) {
        set.down(this.options.name, function (err) {
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

        result.push(migration.description || this.projectConfig.noDescriptionText || '<No Description>');

        if (set.lastRun === migration.title) {
            result.push(chalk.green(this.projectConfig.lastRunIndicator || '<==='));
        }

        return result;
    }

    displayHelp() {
        this.serverless.cli.generateCommandsHelp(['migrate']);
    }
}

module.exports = MigratePlugin;