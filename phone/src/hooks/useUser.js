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

    const fetchUser = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/api/users/${uuid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);

        setError(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uuid, jwt]);

  return { data: user, loading, error };
}
