import { useState, useEffect } from "react";
import { useApi } from "@/src/contexts/ApiContext";

export function useCurrentUser(uuid) {
  const { api } = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    if (!uuid) {
      setUser(null);
      setLoading(false);
      return;
    }

    api.users
      .get(uuid)
      .then(async (response) => {
        if (!response.ok) throw response.status;
        const data = await response.json();
        setUser(data);
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
        setError(err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data: user, loading, error };
}
