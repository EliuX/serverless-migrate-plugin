
Serverless plugin for migrate
==============================
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![npm version](https://badge.fury.io/js/serverless-migrate-plugin.svg)](https://badge.fury.io/js/serverless-migrate-plugin)

This is a Serverless plugin that allows you to use the basic features of [migrate][migrate-npm]. It makes possible:

* Awareness of the environment variables configured in your serverless.yml
* Adds the env variable `SERVERLESS_ROOT_PATH` which points to the root directory of your project.
* Make the commands available via the `serverless` CLI

These migrations are platform independent, regardless the chosen database or cloud provider.

## Features
Watch the [CHANGELOG](./CHANGELOG.md) to see what has been added to the date.

## Quick start
Check out the project located in the folder [example](example) of this repository. It contains a 
README with all the explanation you need to start creating your migrations. 
Just for you to have an idea, this is the only thing you need to start doing your migrations:

1. Install `serverless-migrate-plugin` in your project:
```bash
npm i serverless-migrate-plugin
```

1. Add it to your _serverless.yml_ to the section of `plugins`:
```yaml
plugins: 
  - serverless-migrate-plugin
```

1. Create your first migration:
```bash
sls migrate create <your-migration-name>
```

Now you are ready to implement your migrations. Once you have finished you can test with using

`sls migrate up` and `sls migrate down`.

It is highly recommended you to read about how to 
[create migrations for migrate](https://github.com/tj/node-migrate#creating-migrations).

## Built With
* [Serverless framework](https://serverless.com/): A powerful, unified experience to develop, deploy, 
test, secure, and monitor your Serverless applications.
* [Migrate](https://github.com/tj/node-migrate): Abstract migration framework for node.
* [NodeJS](https://nodejs.org/): As runtime for Javascript 8+.
                                                 

## Author
* **Eliecer Hernandez** - [eliecerhdz@gmail.com](mailto:eliecerhdz@gmail.com). 
For more information, please visit my [website](http://eliux.github.io).

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

[migrate-npm]: https://www.npmjs.com/package/migrate