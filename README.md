
# Serverless plugin for migrate

This is a Serverless plugin for [migrate][migrate-npm]. It will allow to use the features of this migration framework
for node while being aware of the environment variables configured in your serverless.yml and will make the commands
available via the `serverless` cli.

These migrations are platform independent, regardless the chosen database or cloud provider.

## Quick start
Check out the project located in the folder [example](example) of this repository. It contains a 
README with all the explanation you need to start creating your migrations.

## Built With
* [Serverless framework](https://serverless.com/): A powerful, unified experience to develop, deploy, 
test, secure, and monitor your Serverless applications.
* [Migrate](https://github.com/tj/node-migrate): Abstract migration framework for node.

.. and of course Javascript 8+.
                                                 

## Author
* **Eliecer Hernandez** - [eliecerhdz@gmail.com](mailto:eliecerhdz@gmail.com). 
For more information, please visit my [website](http://eliux.github.io).

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

[migrate-npm]: https://www.npmjs.com/package/migrate