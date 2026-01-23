import React, { createContext, useCallback, useContext, useRef } from "react";
import APIClient from "@/src/utils/api/client";
import Api from "@/src/utils/api";
import Constants from "expo-constants";

const ApiContext = createContext(null);

export default ApiContext;

const API_PORT = process.env.EXPO_PUBLIC_API_PORT;

export function ApiProvider({ children }) {
  const client = useRef(null);
  const host = Constants.expoConfig.hostUri?.split(":")[0] ?? "localhost";
  client.current = new APIClient("http", host, API_PORT, {});

  const api = new Api(client.current);

  const setHeaders = useCallback((headers) => {
    client.current.headers = headers;
  }, []);

  return (
    <ApiContext.Provider value={{ api, setHeaders }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
