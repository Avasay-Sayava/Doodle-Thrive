import { useApi } from "@/src/contexts/ApiContext";
import { useApiAction } from "@/src/hooks/api/useApiAction";
import { useMemo } from "react";

export function useTokensActions() {
  const { api } = useApi();
  const { run, loading, error, data } = useApiAction();

  const actions = useMemo(
    () => ({
      auth: (username, password) =>
        run(() => api.tokens.auth(username, password)),
    }),
    [api.tokens, run],
  );

  return { ...actions, loading, error, user: data };
}
