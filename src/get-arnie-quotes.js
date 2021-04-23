const { httpGet } = require('./mock-http-interface');

// Avoid magic values, set the response types here. Could be set via config in production.
const SUCCESS = 'Arnie Quote';
const FAILURE = 'FAILURE';

/**
 * Parses the response to ensure the body is an object
 * @param {*} param0 
 * @returns 
 */
const responseParser = ({ status, body }) => ({ status, body: JSON.parse(body) });

/*
  Returns a single object with an 'Arnie Quote' as the key
  and the relevant quote.

  Upon error, the object will have the key 'FAILURE' with the value
  set to the error.
*/
const getArnieQuote = async (url) => {
  const { body, status } = await httpGet(url).then(responseParser);
  const key = status === 200 ? SUCCESS : FAILURE;
  return {
    [key]: body.message
  };
}

/*
  Returns a list of objects with "Arnie Quotes" or errors.
  See `getArnieQuote()` for details.

  This function assumes `urls` has already been validated to
  be a list of url strings.
*/
const getArnieQuotes = async (urls) => {
  const requests = urls.map(getArnieQuote);
  const results = await Promise.all(requests);
  return results;
};

module.exports = {
  getArnieQuotes,
  getArnieQuote,
};
