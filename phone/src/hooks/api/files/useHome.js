import { useEffect, useCallback, useMemo } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";
import { useFilesRefresh } from "@/src/contexts/FilesRefreshContext";

export function useHome() {
  const { getAll, data, loading, error } = useFilesActions();
  const { refreshKey } = useFilesRefresh();

  const refresh = useCallback(() => {
    getAll();
  }, [getAll]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  const files = useMemo(() => {
    const allFiles = data ? Object.values(data) : null;
    const filtered = allFiles?.filter(
      (file) => !allFiles.includes(file.parent),
    );
    return filtered?.filter((file) => !file.trashed);
  }, [data]);

  return {
    files,
    loading: loading || (data === null && error === null),
    error,
    refresh,
  };
}
