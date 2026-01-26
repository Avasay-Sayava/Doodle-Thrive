import { useEffect, useCallback } from "react";
import { useFilesActions } from "@/src/hooks/api/files/useFilesActions";

export function useFolder(folderId = null) {
  const { get, getAll, data, loading, error } = useFilesActions();

  const refresh = useCallback(() => {
    if (folderId) {
      const childrenIds = get(folderId).children;
      return childrenIds.map((uuid) => get(uuid));
    } else {
      const files = Object.values(getAll());
      return files.filter((file) => file.parent === folderId);
    }
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
