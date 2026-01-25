import { useEffect, useCallback } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";

export function useShared() {
  const { get, getAll, data, loading, error } = useFilesActions();
  const refresh = useCallback((uuid) => {
    Object.fromEntries(Object.entries(getAll()).filter(([key, value]) => value.owner != uuid));
  }, [getAll]);

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
