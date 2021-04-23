const http = require('./mock-http-interface');
const spyOnHttpGET = jest.spyOn(http, 'httpGet');
const { getArnieQuotes, getArnieQuote } = require('./get-arnie-quotes');

// These tests have a heap of magic number references, consider refactoring to remove them

const urls = [
  'http://www.smokeballdev.com/arnie0',
  'http://www.smokeballdev.com/arnie1',
  'http://www.smokeballdev.com/arnie2',
  'http://www.smokeballdev.com/arnie3',
];

test('expect no throws', () => {
  expect.assertions(1);
  expect(async () => await getArnieQuotes(urls)).not.toThrow(); 
});

test('responses to be correct', async () => {
  expect.assertions(5);

  const results = await getArnieQuotes(urls);
  
  expect(results.length).toBe(4);

  // Consider refactoring to use `test.each` with a map
  expect(results[0]).toEqual({ 'Arnie Quote': 'Get to the chopper' });
  expect(results[1]).toEqual({ 'Arnie Quote': 'MY NAME IS NOT QUAID' });
  expect(results[2]).toEqual({ 'Arnie Quote': `What's wrong with Wolfie?` });
  expect(results[3]).toEqual({ 'FAILURE': 'Your request has been terminated' });
});

test('code to be executed in less than 400ms', async () => {
  expect.assertions(2);

  const startTime = process.hrtime();
  await getArnieQuotes(urls);
  const [ seconds, nanos ] = process.hrtime(startTime);
  
  expect(seconds).toBe(0);
  expect(nanos / 1000 / 1000).toBeLessThan(400);
});

// We've introduced a helper function, we should do a positive test on it
test('single quote return existing quote', async() => {
  expect.assertions(1);
  const response = await getArnieQuote(urls[0]); // Blurk! Consider refactoring to remove magic numbers
  expect(response).toHaveProperty('Arnie Quote', 'Get to the chopper'); //...and values
})

// We've introduced a helper function, we should do a negative test on it
test('single quote returns failure quote', async() => {
  expect.assertions(1);
  const response = await getArnieQuote(urls[3]); // Blurk! Consider refactoring to remove magic numbers
  expect(response).toHaveProperty('FAILURE', 'Your request has been terminated'); //...and values
})

// Satisfies testing requirement 1, referenced by tip: Not all of the requirements are covered by the unit tests.
test('arnie method uses a GET request', async () => {
  expect.assertions(1);

  spyOnHttpGET.mockClear();
  const results = await getArnieQuote(urls[0]);
  expect(spyOnHttpGET).toHaveBeenCalledTimes(1);
});
