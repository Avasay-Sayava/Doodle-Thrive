import { useState, useCallback } from "react";

export function useApiAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const run = useCallback((promiseSupplier) => {
    setLoading(true);
    setError(null);
    setData(null);

    return promiseSupplier()
      .then(async (response) => {
        if (!response.ok) throw response.status;

        const contentType = response.headers.get("Content-Type");
        const result =
          contentType && contentType.includes("application/json")
            ? await response.json()
            : true;

        if (result.error) throw result.error;

        setData(result);
        return result;
      })
      .catch((err) => {
        console.error("API Action failed", err);
        setError(err);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { run, loading, error, data };
}
