
# Serverless plugin for migrate

This is a Serverless plugin for [migrate][migrate-npm]. It will allow to use the features of this migration framework
for node while being aware of context of your Serverless project.

This migrations are platform independent in any way: No matter the chosen database or cloud provider.
It basically allows you to use the same mechanism to communicate with your database the same way you do it
in your Serverless functions. It means that it will understand env variables you have set in your serverless.yml
and allow you to configure it throw there.


## An example
Check out this practical example, hosted in the serverless/examples official repository.


[migrate-npm]: https://www.npmjs.com/package/migrate