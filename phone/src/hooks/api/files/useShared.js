import { useEffect, useCallback, useMemo } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";
import { useAuth } from "@/src/contexts/AuthContext";
import { useFilesRefresh } from "@/src/contexts/FilesRefreshContext";

export function useShared() {
  const { getAll, data, loading, error } = useFilesActions();
  const { refreshKey } = useFilesRefresh();

  const { uuid } = useAuth();

  const refresh = useCallback(() => {
    getAll();
  }, [getAll]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  const files = useMemo(() => {
    const allFiles = data ? Object.values(data) : null;
    const filtered = allFiles?.filter((file) => file.owner !== uuid);
    return filtered?.filter((file) => !file.trashed);
  }, [data, uuid]);

  return {
    files,
    loading: loading || (data === null && error === null),
    error,
    refresh,
  };
}
