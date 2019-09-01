# Demo project for serverless-migrate-plugin

In this project we are going to use the `serverless-migrate-plugin` in order
to handle migration in our projects using [migrate][migrate-npm].

## How to set it up

Following the next steps we can make serverless-migrate-plugin ready to be used
in our project:

1. Firstly, if you dont have it create a simple serverless project:

```bash
serverless create --template aws-nodejs --path sls-migrate-plugin-example
cd sls-migrate-plugin-example
npm init
```

1. Install the serverless-migrate-plugin:

```bash
npm i --save-dev serverless-migrate-plugin
```

1. Add a reference in your serverless.yml:

```yml
# serverless.yml file

plugins:
  - serverless-migrate-plugin
```

... and that will be it. You are now ready for doing migrations.

## How to demo

Once we have the plugin instaled we can check the command line to see what options we have:

```bash
sls migrate --help
```

and try out the commands:

* migrate ....................... Migrations management for Serverless
* migrate list .................. List migrations and their status
* migrate up .................... Migrates up
* migrate down .................. Migrates down

Display the help for specific commands if you want to see more details about them. E.g.:

```bash
sls migrate list --help
```

### Creating migrations

In order to create a migration you should use the original `migrate` cli with the command `create`:

```bash
migrate create [name]
```

Please specify the name prefixed by the name of the ticket where you added such feature. e.g.

```bash
migrate create add-second-model
```

### Move until an specific migration

Every time you migrate up and down you get until the end of it:

```bash
$ sls migrate up
Adding new model
second model added
do action using DATABASE_NAME=content
migration up: completed
```

But sometimes you want to move only until an specific migration where you did something of interest. For such cases, 
you can specify the option `name`, specifying the same name you put when you created that migration. E.g.

```bash
$ sls migrate list
1567291329157-add-new-model.js [Sat Aug 31 2019 23:41:35] First migration
1567306997190-add-second-model.js [Sat Aug 31 2019 23:41:35] <No Description>
1567307130689-using-env-variable-defined-in-serverless.js [Sat Aug 31 2019 23:41:35] Get env variable defined in serverless.yml <===
```

The we would like to move just one migration down, until the migration named `add-second-model`:

```bash
$ sls migrate down -n add-second-model
undo action using DATABASE_NAME=content
migration down: completed
```

This way, you migrated one step down until the moment you added a second model. You can check this:

```bash
$ sls migrate list
1567291329157-add-new-model.js [Sat Aug 31 2019 23:41:35] First migration
1567306997190-add-second-model.js [Sat Aug 31 2019 23:41:35] <No Description> <===
1567307130689-using-env-variable-defined-in-serverless.js [not run] Get env variable defined in serverless.yml
```

### Use a diferent migration store

Sometimes we need to keep track of different migrations of the same application. For instance, imagine that you want to track migrations of your
database for different stages of your application, e.g. test, staging and production. You can do that by specifying the option `storage` and the
folder where you want to put it:

```bash
sls migrate list --storage=.migrations-$SLS_STAGE
```

then supposing you have a migration like

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

and a configuration like

```yml
# serverless.yml file

  environment:
    NODE_PATH: "./:/opt/node_modules"
    CONNECTION_STRING: ${self:custom.stages.${self:provider.stage}.CONNECTION_STRING}

custom:
  stages:
    test:
      CONNECTION_STRING: "protocol://my-connection-string-for-tests-and-staging"
    staging: ${self:custom.stages.test}
    production:
      CONNECTION_STRING: "protocol://my-connection-string-for-production"
```

You will be able to execute migrations on different scenarios (stages).

Note:
> It is recommended to make invisible such store files by adding a `.` at the beginning and add them to the ignore files.


[migrate-npm]: https://www.npmjs.com/package/migrate