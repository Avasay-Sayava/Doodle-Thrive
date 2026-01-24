import { useCallback } from "react";
import { useUsersActions } from "../api/users/useUsersActions";

export function useSignUp() {
  const { create, loading, error } = useUsersActions();

  const handleSignUp = useCallback(
    async (username, password, image, description) => {
      return await create(username, password, { image, description })
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    [create],
  );

  return { handleSignUp, loading, error };
}
