import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const FilesRefreshContext = createContext(null);

export function FilesRefreshProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshAll = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({ refreshKey, refreshAll }),
    [refreshKey, refreshAll],
  );

  return (
    <FilesRefreshContext.Provider value={value}>
      {children}
    </FilesRefreshContext.Provider>
  );
}

export function useFilesRefresh() {
  const context = useContext(FilesRefreshContext);
  if (!context) {
    throw new Error(
      "useFilesRefresh must be used within a FilesRefreshProvider",
    );
  }
  return context;
}
