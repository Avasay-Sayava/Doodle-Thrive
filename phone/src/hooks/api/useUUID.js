import { useState, useEffect } from "react";

const BASE_URL = process.env.API_BASE_URL;

export function useUUID(jwt) {
  const [uuid, setUUID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jwt) {
      setUUID(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${BASE_URL}/api/tokens`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }).then(async (response) => {
      if (!response.ok) throw response.status;
      const data = await response.json();
      setUUID(data.id);
    }).catch((err) => {
      console.error("Failed to fetch UUID", err);
      setError(err);
      setUUID(null);
    }).finally(() => {
      setLoading(false);
    });
  }, [jwt]);

  return { data: uuid, loading, error };
}
