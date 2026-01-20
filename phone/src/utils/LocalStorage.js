import AsyncStorage from "@react-native-async-storage/async-storage";

const LocalStorage = {
  get: async (key) => {
    return await AsyncStorage.getItem(key);
  },
  set: async (key, value) => {
    return await AsyncStorage.setItem(key, value);
  },
  remove: async (key) => {
    return await AsyncStorage.removeItem(key);
  },
};

export default LocalStorage;
