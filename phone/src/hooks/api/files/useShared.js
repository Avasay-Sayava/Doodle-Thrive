import { useEffect, useCallback, useMemo } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";
import { useAuth } from "@/src/contexts/AuthContext";

export function useShared() {
  const { getAll, data, loading, error } = useFilesActions();

  const { uuid } = useAuth();

  const refresh = useCallback(() => {
    getAll();
  }, [uuid, getAll]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const files = useMemo(() => {
    const allFiles = data ? Object.values(data) : null;
    return allFiles?.filter((file) => file.owner !== uuid);
  }, [data, uuid]);

  return {
    files,
    loading: loading || (data === null && error === null),
    error,
    refresh,
  };
}
