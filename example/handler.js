'use strict';

module.exports.hello = async (event, context) => {
  context.succeed({
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  });
};
