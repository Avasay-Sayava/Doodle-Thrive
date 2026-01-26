import { useEffect, useCallback } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";

export function useStarred() {
  const { get, getAll, data, loading, error } = useFilesActions();
  const refresh = useCallback(() => {
    Object.fromEntries(Object.entries(getAll()).filter(([key, value]) => (value.starred)));
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