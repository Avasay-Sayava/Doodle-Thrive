import { useEffect, useCallback, useMemo } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";

export function useHome() {
  const { getAll, data, loading, error } = useFilesActions();

  const refresh = useCallback(() => {
    getAll();
  }, [getAll]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const files = useMemo(() => {
    const allFiles = data ? Object.values(data) : null;
    return allFiles?.filter((file) => !data.includes(file.parent));
  }, [data]);

  return {
    files,
    loading: loading || (data === null && error === null),
    error,
    refresh,
  };
}
