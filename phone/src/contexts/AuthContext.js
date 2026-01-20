import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUUID } from "@/src/hooks/useUUID";
import { useUser } from "@/src/hooks/useUser";

const AuthContext = createContext(null);
const storageKey = "token";

export default AuthContext;

export function AuthProvider({ children }) {
  const [jwt, setJWT] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { uuid, loading: uuidLoading, error: uuidError } = useUUID(jwt);
  const { user, loading: userLoading, error: userError } = useUser(uuid, jwt);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem(storageKey);
        if (token) {
          setJWT(token);
        }
      } catch (err) {
        console.error("Failed to load token", err);

        setError(err);
        setJWT(null);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const signin = useCallback(async (token) => {
    await AsyncStorage.setItem(storageKey, token);
    setJWT(token);
  }, []);

  const signout = useCallback(async () => {
    await AsyncStorage.removeItem(storageKey);
    setJWT(null);
  }, []);

  const auth = {
    jwt,
    uuid,
    user,
    loading: loading || uuidLoading || userLoading,
    error: error || uuidError || userError,
    signin,
    signout,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
