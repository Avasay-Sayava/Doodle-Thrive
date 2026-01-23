class APIClient {
  #protocol;
  #host;
  #port;
  #headers;

  constructor(protocol, host, port, headers) {
    this.#protocol = protocol;
    this.#host = host;
    this.#port = port;
    this.#headers = headers;
  }

  #fetch = async (path, method, headers, body) => {
    return await fetch(
      `${this.#protocol}://${this.#host}${this.#port}${path}`,
      {
        method,
        headers: {
          ...this.#headers,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      },
    );
  };

  async get(path, headers) {
    return await this.#fetch(path, "GET", headers);
  }

  async post(path, headers, body) {
    return await this.#fetch(path, "POST", headers, body);
  }

  async put(path, headers, body) {
    return await this.#fetch(path, "PUT", headers, body);
  }

  async patch(path, headers, body) {
    return await this.#fetch(path, "PATCH", headers, body);
  }

  async delete(path, headers) {
    return await this.#fetch(path, "DELETE", headers);
  }

  set headers(headers) {
    this.#headers = headers;
  }

  get headers() {
    return this.#headers;
  }
}

export default APIClient;
