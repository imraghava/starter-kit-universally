import express from 'express';
import { get } from 'lodash';
import Network from 'store/Network';
import config from 'utils/config';

const CONTENTFUL_SPACE = config('contentfulSpace');
const CONTENTFUL_ACCESS_TOKEN = config('contentfulAccessToken');

const app = express();
const network = new Network({});
const stringifyQueryString = data => Object.entries(data).map(pair => pair.join('=')).join('&');
const assignAccessToken = query => ({
  ...query,
  access_token: CONTENTFUL_ACCESS_TOKEN,
});
const fetch = ({ query, endpoint }) => {
  const queryString = `?${stringifyQueryString(assignAccessToken(query))}`;
  const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE}${endpoint}${queryString}`;

  return network.fetch(url, {
    maxAge: 0,
  });
};
const errorHandler = res => (error) => {
  const status = get(error, 'response.status', 500);
  // Only log the error if it was a 5xx error
  // A 4xx error was probably the user’s fault
  if (status >= 500) {
    console.error('Error while fetching contentful', error);
  }
  res.removeHeader('Content-Type');
  res.status(status).end();
};

app.get('/entries', (req, res) => {
  fetch({ query: req.query, endpoint: req.path })
    .then((response) => {
      res.send(response);
    })
    .catch(errorHandler(res));
});

export default app;
