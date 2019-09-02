# Demo project for serverless-migrate-plugin

In this project we are going to see how to use migrations using `serverless-migrate-plugin`.

## How to set it up

Following the next steps we can make `serverless-migrate-plugin` ready to be used
in our project:

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

... and thatis it. Your project is now setup for doing migrations.

## How to demo

Once we have the plugin installed we can check the command line to see what options we have:

```bash
sls migrate --help
```

and try out the commands:

migrate ....................... Migrations management for Serverless
migrate list .................. List migrations and their status
migrate up .................... Migrates up
migrate down .................. Migrates down
migrate create ................ Creates migration file

Display the help for specific commands if you want to see more details about them. E.g.:

```bash
sls migrate list --help
```

### Creating migrations

In order to create a migration you should use the original `migrate` cli with the command `create`:

```bash
migrate create [name]
```

E.g.

```bash
migrate create add-second-model
```

### Move to an specific migration

Every time you migrate up and down, you get until the end of it:

```bash
$ sls migrate up
Adding new model
second model added
do action using DATABASE_NAME=content
migration up: completed
```

But sometimes you want to move only to an specific migration where you did something of interest. For such cases, 
you can specify the option `name`, putting the same you used when you created that migration. 

For instance, lets see where we are right now, so we can move until the migration called `add-second-model`.

```bash
$ sls migrate list
1567291329157-add-new-model.js [Sat Aug 31 2019 23:41:35] First migration
1567306997190-add-second-model.js [Sat Aug 31 2019 23:41:35] <No Description>
1567307130689-using-env-variable-defined-in-serverless.js [Sat Aug 31 2019 23:41:35] Get env variable defined in serverless.yml <===
```

As you see that migration is behind the one we are right now, so we have to move `down` to it:

```bash
$ sls migrate down --name add-second-model
undo action using DATABASE_NAME=content
migration down: completed
```

Check it worked successfully:

```bash
$ sls migrate list
1567291329157-add-new-model.js [Sat Aug 31 2019 23:41:35] First migration
1567306997190-add-second-model.js [Sat Aug 31 2019 23:41:35] <No Description> <===
1567307130689-using-env-variable-defined-in-serverless.js [not run] Get env variable defined in serverless.yml
```

As you see the `lastRunIndicator`, which by default is `<===` is pointing to the migration called `add-second-model`.
Also notice that the one afterwards is not applied, because it says `[not run]`.

### Use a different migration store

Sometimes we need to keep track of different migrations for a same application. For instance, imagine that you want to 
track migrations for different stages of your application, e.g. test, staging and production. You can do that by 
specifying the option `storage` and the folder where you want to put it:

```bash
sls migrate list --storage=.migrate-$SLS_STAGE
```

This way you can have a migration file per stage:

- .migrate-test
- .migrate-staging
- .migrate-production

### Going a little further

With the help of your serverless.yml we can make these configurations even more flexible. Let's suppose you have a 
migration like this:

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

... and you want to use a `CONNECTION_STRING` different for `production` than the rest of the stages. You can do it 
with a configuration like

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
    test: ${self:custom.stages.test}
    production:
      CONNECTION_STRING: "protocol://my-connection-string-for-production"
      MIGRATION_FILE: migrate-staging
```

This way it will not only provide a different `CONNECTION_STRING` for production, but it will
use one migration file for dev and staging that is different to the one that uses production.

>Note:  These use-cases are for explanation purposes only.

### Custom variables
In the serverless.yml in the section custom.migrate, you can specify some variables:

* `store`: The migration states store file you want to use
* `lastRunIndicator`: The text to append to the last migration that is applied
* `noDescriptionText`: Text to show when a migration has no description
* `ignoreMissing`: Ignores missing migration files if they are not found. 
* `dateFormat`: The date format to use on the reports. By default it uses `yyyy-mm-dd`.
* `templateFile`: The template to use to create your migrations.
By default it is `false`, which makes the program throw an error if a migration is absent.

E.g.
```yaml
custom:
  migrate:
    store: .migrate2
    lastRunIndicator: <
    noDescriptionText: '?'
    ignoreMissing: true
    dateFormat: "yyyy-MM-dd hh:mm:ssZ"
    templateFile: "my-project-template.js"
```

>Note: It is recommended to make invisible such store files by adding a `.` at the beginning and add them to the ignore files.


[migrate-npm]: https://www.npmjs.com/package/migrate
