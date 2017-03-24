import { extendObservable, ObservableMap, observable, computed } from 'mobx';
import serverWait from 'utils/mobx-server-wait';

/**
 * This store planets.
 */
export default class Planets {

  /**
   * Constructor
   * @param {object} Domain store
   */
  constructor({ planets = {} }, network) {
    this.fetch = network.fetch;
    this.planets = observable.map(planets.planets);
    // extendObservable(this, planets);
  }

  /**
   * @var {string} API endpoint
   */
  apiUrl = 'https://swapi.co/api/planets';

  // Contains all fetched planets
  planets = new ObservableMap();

  /**
   * Fetch all planets
   * @param {Number} Page number
   * @return {Promise}
   */
  @serverWait
  fetchAll({ page = 1 } = {}) {
    return this.fetch(`${this.apiUrl}/?page=${page}`)
    .then((res) => {
      res.results.forEach((planet) => {
        const id = planet.url.match(/(\d+)\/$/);
        planet.id = id[1]; // eslint-disable-line
        this.planets.set(id[1], planet);
      });
      return res;
    });
  }

  @computed
  get all() {
    return this.planets.values().sort((a, b) => new Date(a.edited) - new Date(b.edited));
  }

  /**
   * Fetch planet by id
   * @param {string} Planet Id
   * @return {Promise}
   */
  @serverWait
  fetchById(id) {
    if (this.planets.has(id)) {
      return Promise.resolve(this.planets.get(id));
    }

    return this.fetch(`${this.apiUrl}/${id}/`)
    .then(result => this.planets.set(id, result));
  }

  getById(id) {
    return this.planets.get(id);
  }
}
