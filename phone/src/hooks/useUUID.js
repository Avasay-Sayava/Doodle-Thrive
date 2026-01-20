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

    const fetchUUID = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/api/tokens`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch UUID");

        const data = await response.json();
        setUUID(data.id);
      } catch (err) {
        console.error(err);

        setError(err);
        setUUID(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUUID();
  }, [jwt]);

  return { data: uuid, loading, error };
}
