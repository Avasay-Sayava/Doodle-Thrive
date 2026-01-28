import * as SecureStore from "expo-secure-store";

const LocalStorage = {
  get: async (key) => {
    return await SecureStore.getItemAsync(key);
  },
  set: async (key, value) => {
    return await SecureStore.setItemAsync(key, value);
  },
  remove: async (key) => {
    return await SecureStore.deleteItemAsync(key);
  },
};

export default LocalStorage;
