import { useEffect, useCallback } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";
import { useAuth } from "@/src/contexts/AuthContext";

export function useShared() {
  const { getAll, data, loading, error } = useFilesActions();

  const { uuid } = useAuth();

  const refresh = useCallback(() => {
    const files = Object.values(getAll());
    return files.filter((file) => file.owner !== uuid);
  }, [uuid, getAll]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    files: data,
    loading: loading || (data === null && error === null),
    error,
    refresh,
  };
}
