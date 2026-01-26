import React, { createContext, useCallback, useContext, useMemo } from "react";
import APIClient from "@/src/utils/api/client";
import Api from "@/src/utils/api";
import Constants from "expo-constants";

const ApiContext = createContext(null);

export default ApiContext;

const API_PORT = process.env.EXPO_PUBLIC_API_PORT;

export function ApiProvider({ children }) {
  const host = Constants.expoConfig.hostUri?.split(":")[0] ?? "localhost";
  const client = useMemo(() => new APIClient("http", host, API_PORT, {}), []);
  const api = useMemo(() => new Api(client), [client]);

  const setHeaders = useCallback(
    (headers) => {
      client.headers = headers;
    },
    [client.headers],
  );

  return (
    <ApiContext.Provider value={{ api, setHeaders }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}
