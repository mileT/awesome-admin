// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('request');

module.exports = {
  post: (url, options) =>
    new Promise((resolve, reject) => {
      request.post(url, options, (error, response, body) => {
        if (error) reject(error);
        else resolve(body);
      });
    }),
};
