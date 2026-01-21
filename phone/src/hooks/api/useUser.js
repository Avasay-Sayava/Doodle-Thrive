import { useState, useEffect } from "react";

const BASE_URL = process.env.API_BASE_URL;

export function useUser(uuid, jwt) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uuid || !jwt) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${BASE_URL}/api/users/${uuid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }).then(async (response) => {
      if (!response.ok) throw response.status;
      const data = await response.json();
      setUser(data);
    }).catch((err) => {
      console.error("Failed to fetch user", err);
      setError(err);
      setUser(null);
    }).finally(() => {
      setLoading(false);
    });
  }, [uuid, jwt]);

  return { data: user, loading, error };
}
