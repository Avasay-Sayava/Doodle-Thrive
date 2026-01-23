import { useState, useEffect } from "react";
import { useApi } from "@/src/contexts/ApiContext";

export function useCurrentUUID(jwt) {
  const { api } = useApi();
  const [uuid, setUUID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    if (!jwt) {
      setUUID(null);
      setLoading(false);
      return;
    }

    api.tokens
      .uuid(jwt)
      .then(async (response) => {
        if (!response.ok) throw response.status;
        const data = await response.json();
        setUUID(data.id);
      })
      .catch((err) => {
        console.error("Failed to fetch UUID", err);
        setError(err);
        setUUID(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jwt]);

  return { data: uuid, loading, error };
}
