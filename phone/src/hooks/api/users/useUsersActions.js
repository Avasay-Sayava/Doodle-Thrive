import { useApi } from "@/src/contexts/ApiContext";
import { useApiAction } from "@/src/hooks/api/useApiAction";
import { useMemo } from "react";

export function useUsersActions() {
  const { api } = useApi();
  const { run, loading, error, data } = useApiAction();

  const actions = useMemo(
    () => ({
      get: (uuid) => run(() => api.users.get(uuid)),

      create: (username, password, { image, description }) =>
        run(() => api.users.create(username, password, { image, description })),

      find: (username) => run(() => api.users.find(username)),
    }),
    [api.users, run],
  );

  return { ...actions, loading, error, data };
}
