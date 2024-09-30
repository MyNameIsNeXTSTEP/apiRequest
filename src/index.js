'use strict'

import 'dotenv/config';

/**
 * @typedef {import('./index.d.ts').IRequestConfig} IRequestConfig
 */

const EApiRequestMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

class APIRequest {
  #hostname = process.env.API_HOST;
  #port = process.env.API_PORT;
  #host = '';
  #requestConfig;
  #abortController;

  /**
   * @param {IRequestConfig} requestConfig 
   */
  constructor(requestConfig) {
    this.#requestConfig = requestConfig;
    this.#abortController = new AbortController();
    this.#host = `${this.#hostname}:${this.#port}`;
  };

  async doRequest() {
    try {
      const { url, ...rest } = this.#prepareRequestConfig();
      return await fetch(this.#host + url, rest);
    } catch (error) {
      console.log('API Request error:\n', error);
    };
  };

  #prepareRequestConfig() {
    const { url, method, headers, body } = this.#requestConfig;

    const config = {
      url,
      method,
      headers: {
        ...headers,
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json',
      },
      signal: this.#abortController.signal,
    };
    if (this.#requestConfig.method === EApiRequestMethods.POST && body) {
      return {
        ...config,
        body: JSON.stringify(body)
      };
    }
    return config;
  };

  abort() {
    this.#abortController.abort();
  };

  /**
   * @param {number} interval
   * @param {number} [attempts=3]
   */
  async retryWith(interval, attempts = 3) {
    while (attempts !== 0) {
      setInterval(
        async () => await this.doRequest(),
        interval,
      )
    };
    --attempts;
  }
};

export default APIRequest;
