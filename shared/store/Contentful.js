import { extendObservable } from 'mobx';
import timing from 'utils/timing';
import { parse, queryToString } from 'utils/contentful';
import config from 'utils/config';

const apiUrl = config('apiUrl');

export default class Contentful {
  constructor({ contentful = {} }, network) {
    this.fetch = network.fetch;
    extendObservable(this, contentful);
  }

  @timing.promise
  fetchByContentType(contentType, query = {}) {
    const q = queryToString({ ...query, content_type: contentType });
    const url = `${apiUrl}/contentful/entries?${q}`;

    return this.fetch(url, { force: true })
      .then(data => parse(data))
      .catch((err) => {
        console.warn('Error fetching contentful data', err);
        return {};
      });
  }

  @timing.promise
  fetchById(id, query) {
    const q = queryToString(query);
    const url = `${apiUrl}/contentful/entries/&{id}?${q}`;

    return this.fetch(url, { force: true })
      .then(data => parse(data))
      .catch((err) => {
        console.warn('Error fetching contentful data', err);
        return {};
      });
  }
}
