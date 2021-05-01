# Demo project for serverless-migrate-plugin

In this project we are going to see how to start migrating data in your project using `serverless-migrate-plugin`.

## How to set it up

Let's install `serverless-migrate-plugin` following the next steps:

1. Firstly, create a simple serverless project, if you don't have one:

```bash
serverless create --template aws-nodejs --path sls-migrate-plugin-example
cd sls-migrate-plugin-example
npm init
```

1. Install the `serverless-migrate-plugin` as a devDependency:

```bash
npm i --save-dev serverless-migrate-plugin
```

1. Add a reference in your `serverless.yml`:

```yml
# serverless.yml file

plugins:
  - serverless-migrate-plugin
```

... and that is it. Your project is now setup for doing migrations.

## How to demo

Once we have the plugin installed, we can check the command line to see what options we have:

```bash
sls migrate --help 
migrate ....................... Migrations management for Serverless
migrate list .................. List migrations and their status
migrate up .................... Migrates up
migrate down .................. Migrates down
migrate create ................ Creates migration file
```

Display the help for specific commands if you want to see more details about them. E.g.:

```bash
sls migrate list --help
```

### Creating migrations

To create migrations we need to run the command:

```bash
sls migrate create -n [name]
```

This command is not idempotent, because even if the migration has the same name the file is prefixed by a unique
identifier. It will be located by default in the folder `/migrations`. This can be changed with the variable
`migrationDir` in the plugin config of your _serverless.yml_.

Once you implement your migration, we can execute it with

```bash
sls migrate up
```

It will run all migrations from the last time executed until the last added migration.
To undo all migrations run thus far, you must run

```bash
sls migrate down
```

Which in the case of running successfully, it will leave the system as if no change was applied before.

### Move to a target migration

Every time we migrate up and down, we apply or undo all the changes:

```bash
$ sls migrate up
Adding new model
second model added
do action using DATABASE_NAME=content
migration up: completed
```

Yet sometimes we want to move only to some specific migration, where we did something of interest. For such cases, 
we can specify the option `name`, putting the same it was used when that migration was created. For every file
the corresponding name will be what is after its hash,

 > The file 1567291329157-add-new-model.js has a migration named "add-new-model"

For demonstration purposes, lets see where our system is right now, so we can move until the migration called
`add-second-model`.

```bash
$ sls migrate list
1567291329157-add-new-model.js [Sat Aug 31 2019 23:41:35] First migration
1567306997190-add-second-model.js [Sat Aug 31 2019 23:41:35] <No Description>
1567307130689-using-env-variable-defined-in-serverless.js [Sat Aug 31 2019 23:41:35] Get env variable defined in serverless.yml <===
```

As it shows up, the migration `add-second-model` is behind the one we are right now, so we have to move `down` to it:

```bash
$ sls migrate down --name add-second-model
undo action using DATABASE_NAME=content
migration down: completed
```

Let's check if this worked successfully:

```bash
$ sls migrate list
1567291329157-add-new-model.js [Sat Aug 31 2019 23:41:35] First migration
1567306997190-add-second-model.js [Sat Aug 31 2019 23:41:35] <No Description> <===
1567307130689-using-env-variable-defined-in-serverless.js [not run] Get env variable defined in serverless.yml
```

The `lastRunIndicator`, which by default is `<===` is pointing to the migration called `add-second-model`.
Notice also that the one after it is has not been applied, because it says `[not run]`.

### Use a different migration store

Sometimes we need to keep track of different migrations for a same application. For instance, imagine that we want to 
track migrations for different stages of our application, e.g. test, `staging` and `production`. It can be done by 
specifying the option `state-file` and the folder where we want to put it:

```bash
sls migrate list --state-file=.migrate-$SLS_STAGE
```

This way we have a migration file per stage:

- .migrate-test
- .migrate-staging
- .migrate-production

In case you want to use your own handler for storing and retrieving the data related to the state of the migrations, you
can specify a class for handling it, with the option `store`. E.g.

```bash
sls migrate list --store=./src/mongodb-store
```

Check out the [official documentation of migrate][migrate-npm] for more information, but it is recommended to use
`node_modules/migrate/lib/file-store.js` as a reference.

### Going a little further

With the help of our serverless.yml we can make these configurations even more flexible. Let's suppose there is a 
migration alike the next one:

```javascript
'use strict'

module.exports.up = function (next) {
  db.connect(process.env.CONNECTION_STRING).doActionUp();
  next();
}

module.exports.down = function (next) {
  db.connect(process.env.CONNECTION_STRING).doActionDown();
  next();
}

module.exports.description = "My migration";
```

... and we want to use a different `CONNECTION_STRING` for `production` than the one used for the rest of the stages.
This can be easily done with a serverless.yml:

```yml
# serverless.yml file

  environment:
    NODE_PATH: "./:/opt/node_modules"
    CONNECTION_STRING: ${self:custom.stages.${self:provider.stage}.CONNECTION_STRING}
    SLS_STAGE: ${self:provider.stage}

custom:
  stages:
    staging:
      CONNECTION_STRING: "protocol://my-connection-string-for-tests-and-staging"
      MIGRATION_FILE: migrate-staging
    test: ${self:custom.stages.staging}
    production:
      CONNECTION_STRING: "protocol://my-connection-string-for-production"
      MIGRATION_FILE: migrate-staging
```

The little trick in the configuration will not only provide a different `CONNECTION_STRING` for production, but it will
also use one migration file for `test` and `staging`, that is different to the one that uses production.

What if I want a different environment variable for migrations?
You also have `custom.migrate.environment`, which will override any value that you have in `provider.environment`.
Therefore, if you have a configuration like

```yml
  environment:
    DATABASE_NAME: content
    ANOTHER_ENV: original content

  custom:
    migrate:
      environment:
        ANOTHER_ENV: overrriden value
```

When you print the env variables `DATABASE_NAME` and `ANOTHER_ENV`:

```javascript
  console.log(`do action using DATABASE_NAME=${process.env.DATABASE_NAME}`);
  console.log(`do action using ANOTHER_ENV=${process.env.ANOTHER_ENV}`);
```

You will get

```bash
do action using DATABASE_NAME=content
do action using ANOTHER_ENV=overrriden value
```

>Note:  These use-cases are for explanation purposes only.

### Custom variables

In the serverless.yml in the section `custom.migrate`, we can define variables that will change aspects of your
migrations:

* `stateFile` (option `state-file`): The file where you want the migrations to be stored. It will be `.migrate` by default.
* `store` (option `store`): The class that will handle the migrations. By default, it uses the one 
in `node_modules/migrate/lib/file-store.js`.
* `lastRunIndicator` (option `last-run-indicator`): The text to append to the last migration that is applied.
* `noDescriptionText`: Text to show when a migration has no description.
* `ignoreMissing`: Ignores missing migration files if they are not found. 
* `dateFormat` (option `date-format`): The date format to use on the reports. By default it uses `yyyy-mm-dd`.
* `migrationDir` (option `migration-dir`): The name of the folder where the migrations will be stored. By default `migrations`.
* `templateFile` (option `template-file`): The template to use to create your migrations.
* `fileExtension`(option `file-extension`): Indicates the file extension for the migrations. By default `.js`.
* `environment`: Overrides the env vars of your app configuration, i.e. `provider.environment`.
By default, it is `false`, which makes the program throw an error if a migration is absent.

E.g.

```yaml
custom:
  migrate:
    stateFile: .migrate2
    store: ./sample-store
    lastRunIndicator: <
    noDescriptionText: '?'
    ignoreMissing: true
    dateFormat: "yyyy-MM-dd hh:mm:ssZ"
    templateFile: "my-project-template.js"
    # migrationDir: ".migrations"
    environment:
      ANOTHER_ENV: overrriden value
```

It is recommended to make invisible such store files by adding a `.` at the beginning and add them to the ignore files.
Also add them to your `.gitignore` file or any other equivalent for the VCS you are using

Happy coding!

[migrate-npm]: https://www.npmjs.com/package/migrate
