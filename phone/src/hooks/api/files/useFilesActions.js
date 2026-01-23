import { useApi } from "@/src/contexts/ApiContext";
import { useApiAction } from "@/src/hooks/api/useApiAction";
import { useMemo } from "react";

export function useFilesActions() {
  const { api } = useApi();
  const { run, loading, error, data } = useApiAction();

  const actions = useMemo(
    () => ({
      get: (uuid) => run(() => api.files.get(uuid)),

      getAll: () => run(() => api.files.getAll()),

      search: (query) => run(() => api.files.search(query)),

      createFile: (name, content, parent, description) =>
        run(() => api.files.createFile(name, content, parent, description)),

      createFolder: (name, parent, description) =>
        run(() => api.files.createFolder(name, parent, description)),

      rename: (uuid, name) => run(() => api.files.rename(uuid, name)),

      move: (uuid, parent) => run(() => api.files.move(uuid, parent)),

      edit: (uuid, content) => run(() => api.files.edit(uuid, content)),

      star: (uuid, starred) => run(() => api.files.star(uuid, starred)),

      updateDescription: (uuid, description) =>
        run(() => api.files.updateDescription(uuid, description)),

      remove: (uuid) => run(() => api.files.delete(uuid)),
    }),
    [api.files, run],
  );

  return { ...actions, loading, error, user: data };
}
