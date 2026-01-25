import { useApi } from "@/src/contexts/ApiContext";
import { useApiAction } from "@/src/hooks/api/useApiAction";
import { useMemo } from "react";

export function usePermissionsActions() {
  const { api } = useApi();
  const { run, loading, error, data } = useApiAction();

  const actions = useMemo(
    () => ({
      get: (fileUuid, permissionUuid) =>
        run(() => api.permissions.get(fileUuid, permissionUuid)),

      getAll: (fileUuid) => run(() => api.permissions.getAll(fileUuid)),

      create: (fileUuid, userUuid, options) =>
        run(() => api.permissions.create(fileUuid, userUuid, options)),

      update: (fileUuid, permissionUuid, options) =>
        run(() => api.permissions.update(fileUuid, permissionUuid, options)),

      remove: (fileUuid, permissionUuid) =>
        run(() => api.permissions.delete(fileUuid, permissionUuid)),
    }),
    [api.permissions, run],
  );

  return { ...actions, loading, error, data };
}
