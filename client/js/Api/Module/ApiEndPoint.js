import ApiService from "./ApiService";

/**
 * @type {{name: string, url: URL, headers: HeadersInit}}
 */
export default class ApiEndPoint {
  constructor({ name = null, url = null, headers = null }) {
    this.name = name.toLowerCase();
    this.url = url;
    this.headers = headers;
  }

  /**
   *
   * @param {RequestInfo} url - If empty, it will use default endpoint
   * @param {RequestInit} options
   * @param {CallableFunction} onResponse
   */
  async fetch(url = null, options = null) {
    if (options == null) {
      options = {
        headers: this.headers,
      };
    }

    if (url == null) {
      url = this.url;
    }

    try {
      const response = await fetch(url, options);
      return response;
    } catch (exception) {
      console.log(exception);
    }
  }
}
