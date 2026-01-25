import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import LocalStorage from "@/src/utils/common/LocalStorage";
import { useUser } from "@/src/hooks/api/users/useUser";
import { useApi } from "@/src/contexts/ApiContext";

const AuthContext = createContext(null);
const tokenStorageKey = "token";
const uuidStorageKey = "uuid";

export default AuthContext;

export function AuthProvider({ children }) {
  const { setHeaders } = useApi();

  const [jwt, setJWT] = useState(null);
  const [uuid, setUUID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (jwt) setHeaders({ Authorization: `Bearer ${jwt}` });
    else setHeaders({});
  }, [jwt, loading, setHeaders]);

  const { user, loading: userLoading, error: userError } = useUser(uuid);

  const signin = useCallback(
    async (token, userUuid) => {
      setHeaders({ Authorization: `Bearer ${token}` });

      await LocalStorage.set(tokenStorageKey, token);
      await LocalStorage.set(uuidStorageKey, userUuid);

      setJWT(token);
      setUUID(userUuid);
    },
    [setHeaders],
  );

  const signout = useCallback(async () => {
    setHeaders({});
    await LocalStorage.remove(tokenStorageKey);
    await LocalStorage.remove(uuidStorageKey);
    setJWT(null);
    setUUID(null);
  }, [setHeaders]);

  useEffect(() => {
    Promise.all([
      LocalStorage.get(tokenStorageKey),
      LocalStorage.get(uuidStorageKey),
    ])
      .then(([token, savedUuid]) => {
        if (token && savedUuid) {
          setHeaders({ Authorization: `Bearer ${token}` });
          setJWT(token);
          setUUID(savedUuid);
        }
      })
      .catch((err) => {
        console.error("Failed to load auth info", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setHeaders]);

  const auth = {
    jwt,
    uuid,
    user,
    loading: loading || (uuid && userLoading),
    error: error || userError,
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
