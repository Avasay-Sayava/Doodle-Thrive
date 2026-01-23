import { useEffect, useCallback } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";

export function useFiles(folderId = null) {
  const { get, getAll, data, loading, error } = useFilesActions();

  const refresh = useCallback(() => {
    return folderId ? get(folderId) : getAll();
  }, [folderId, get]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    user: data,
    loading: loading || (data === null && error === null),
    error,
    refresh,
  };
}
