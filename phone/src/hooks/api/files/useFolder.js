import { useEffect, useCallback, useMemo } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";

export function useFolder(folderId = null) {
  const { getAll, data, loading, error } = useFilesActions();

  const refresh = useCallback(() => {
    getAll();
  }, [getAll]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const files = useMemo(() => {
    const allFiles = data ? Object.values(data) : null;
    return allFiles?.filter((file) => file.parent === folderId);
  }, [data, folderId]);

  return {
    files,
    loading: loading || (data === null && error === null),
    error,
    refresh,
  };
}
