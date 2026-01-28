import { useCallback, useEffect } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";
import { useFilesRefresh } from "@/src/contexts/FilesRefreshContext";

export function useFile(fileId) {
  const { get, data, loading, error } = useFilesActions();
  const { refreshKey } = useFilesRefresh();

  const refresh = useCallback(() => {
    if (!fileId) return;
    get(fileId);
  }, [get, fileId]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  return {
    file: data,
    loading: loading || (data === null && error === null),
    error,
    refresh,
  };
}
