const JSON_HEADER = {
  "Content-Type": "application/json",
};

class Api {
  #client;

  constructor(client) {
    this.#client = client;
  }

  files = {
    createFile: async (name, content, parent, description) => {
      return await this.#client.post("/api/files", JSON_HEADER, {
        name,
        content,
        parent,
        description,
      });
    },

    createFolder: async (name, parent, description) => {
      return await this.#client.post("/api/files", JSON_HEADER, {
        name,
        parent,
        description,
      });
    },

    get: async (uuid) => {
      return await this.#client.get(`/api/files/${uuid}`, {});
    },

    getAll: async () => {
      return await this.#client.get(`/api/files`, {});
    },

    rename: async (uuid, name) => {
      return await this.#client.patch(`/api/files/${uuid}`, JSON_HEADER, {
        name,
      });
    },

    move: async (uuid, parent) => {
      return await this.#client.patch(`/api/files/${uuid}`, JSON_HEADER, {
        parent,
      });
    },

    edit: async (uuid, content) => {
      return await this.#client.patch(`/api/files/${uuid}`, JSON_HEADER, {
        content,
      });
    },

    star: async (uuid, starred) => {
      return await this.#client.patch(`/api/files/${uuid}`, JSON_HEADER, {
        starred,
      });
    },

    trash: async (uuid, trashed) => {
      return await this.#client.patch(`/api/files/${uuid}`, JSON_HEADER, {
        trashed,
      });
    },

    updateDescription: async (uuid, description) => {
      return await this.#client.patch(`/api/files/${uuid}`, JSON_HEADER, {
        description,
      });
    },

    delete: async (uuid) => {
      return await this.#client.delete(`/api/files/${uuid}`, {});
    },

    search: async (query) => {
      return await this.#client.get(`/api/search/${query}`, {});
    },
  };

  permissions = {
    create: async (fileUuid, userUuid, options) => {
      return await this.#client.patch(
        `/api/files/${fileUuid}/permissions`,
        JSON_HEADER,
        {
          options,
        },
      );
    },

    get: async (fileUuid, permissionUuid) => {
      return await this.#client.get(
        `/api/files/${fileUuid}/permissions/${permissionUuid}`,
        {},
      );
    },

    getAll: async (fileUuid) => {
      return await this.#client.get(`/api/files/${fileUuid}/permissions/}`, {});
    },

    update: async (fileUuid, permissionUuid, options) => {
      return await this.#client.patch(
        `/api/files/${fileUuid}/permissions/${permissionUuid}`,
        JSON_HEADER,
        {
          options,
        },
      );
    },

    delete: async (fileUuid, permissionUuid) => {
      return await this.#client.delete(
        `/api/files/${fileUuid}/permissions/${permissionUuid}`,
        {},
      );
    },
  };

  tokens = {
    auth: async (username, password) => {
      return await this.#client.post("/api/tokens", JSON_HEADER, {
        username,
        password,
      });
    },
  };

  users = {
    create: async (username, password, { image, description }) => {
      return await this.#client.post("/api/users", JSON_HEADER, {
        username,
        password,
        info: {
          image,
          description,
        },
      });
    },

    get: async (uuid) => {
      return await this.#client.get(`/api/users/${uuid}`, {});
    },

    find: async (username) => {
      return await this.#client.patch(`/api/users`, JSON_HEADER, {
        username,
      });
    },
  };
}

export default Api;
