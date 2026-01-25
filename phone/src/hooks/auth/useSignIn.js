import { useCallback } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTokensActions } from "@/src/hooks/api/tokens/useTokensActions";

export function useSignIn() {
  const { signin } = useAuth();
  const { auth, loading, error } = useTokensActions();

  const handleSignIn = useCallback(
    async (username, password) => {
      return await auth(username, password)
        .then(async ({ token, id }) => {
          await signin(token, id);
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    [auth, signin],
  );

  return { handleSignIn, loading, error };
}
