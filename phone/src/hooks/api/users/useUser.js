import { useEffect } from "react";
import { useUsersActions } from "@/src/hooks/api/users/useUsersActions";

export function useUser(uuid) {
  const { get, data, loading, error } = useUsersActions();

  useEffect(() => {
    if (uuid) {
      get(uuid);
    }
  }, [uuid, get]);

  const isInitialLoading = uuid && data === null && error === null;

  return {
    user: uuid ? data : null,
    loading: loading || isInitialLoading,
    error,
  };
}
