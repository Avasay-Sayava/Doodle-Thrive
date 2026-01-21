import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import LocalStorage from "@/src/utils/LocalStorage";
import { useUUID } from "@/src/hooks/api/useUUID";
import { useUser } from "@/src/hooks/api/useUser";

const AuthContext = createContext(null);
const storageKey = "token";

export default AuthContext;

export function AuthProvider({ children }) {
  const [jwt, setJWT] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { uuid, loading: uuidLoading, error: uuidError } = useUUID(jwt);
  const { user, loading: userLoading, error: userError } = useUser(uuid, jwt);

  const signin = useCallback(async (token) => {
    await LocalStorage.set(storageKey, token);
    setJWT(token);
  }, []);

  const signout = useCallback(async () => {
    await LocalStorage.remove(storageKey);
    setJWT(null);
  }, []);

  useEffect(() => {
    LocalStorage.get(storageKey).then(async (token) => {
      if (token) {
        setJWT(token);
      }
    }).catch((err) => {
      console.error("Failed to get jwt token", err);
      setError(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading || uuidLoading || userLoading)
      return;

    if (!jwt)
      return;

    if (!uuid || !user)
      signout().catch((err) => {
        console.error("Failed to signout", err);
        setError(err);
      });
  }, [uuid, user]);

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
