import { useCallback } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTokensActions } from "@/src/hooks/api/tokens/useTokensActions";
import { useUsersActions } from "../api/users/useUsersActions";

export function useSignUp() {
    const { create } = useUsersActions();
    const { auth, loading, error } = useTokensActions();

    const handleSignUp = useCallback(
        async (username, password, image, description) => {
            return await create(username, password, { image, description }).then(() => {
                return true;
            }).catch(() => {
                return false;
            });
        },
        [auth, create],
    );

    return { handleSignUp, loading, error };
}