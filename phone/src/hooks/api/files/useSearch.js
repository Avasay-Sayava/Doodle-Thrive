import { useCallback, useEffect, useMemo } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";
import { useFilesRefresh } from "@/src/contexts/FilesRefreshContext";

export function useSearch(query) {
  const { search, data, loading, error } = useFilesActions();
  const { refreshKey } = useFilesRefresh();

  const refresh = useCallback(() => {
    if (!query || !query.trim()) return;
    search(query.trim());
  }, [search, query]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  const files = useMemo(() => {
    if (!data || !query) return [];
    const allFiles = Object.values(data);
    return allFiles.filter((file) => !file.trashed);
  }, [data, query]);

  return {
    files,
    loading: loading || (data === null && error === null && !!query),
    error,
    refresh,
  };
}
