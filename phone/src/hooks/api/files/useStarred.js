import { useEffect, useCallback } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";

export function useStarred() {
  const { getAll, data, loading, error } = useFilesActions();

  const refresh = useCallback(() => {
    const files = Object.values(getAll());
    return files.filter(file => file.starred);
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
