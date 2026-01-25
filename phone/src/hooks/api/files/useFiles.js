import { useEffect, useCallback } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";

export function useFiles(folderId = null) {
  const { get, getAll, data, loading, error } = useFilesActions();

  const refresh = useCallback(() => {
    return folderId ? get(folderId) : Object.fromEntries(Object.entries(getAll()).filter(([key, value]) => !value.parent));
  }, [folderId, get]);

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

