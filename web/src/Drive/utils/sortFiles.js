function isFolder(x) {
  return x?.type === "folder";
}

// creates comparator for sorting files
export function createSortComparator(
  sortBy = "name",
  sortDir = "asc",
  foldersMode = "mixed",
) {
  return (a, b) => {
    if (foldersMode === "folders-first") {
      const af = isFolder(a);
      const bf = isFolder(b);
      if (af !== bf) return af ? -1 : 1;
    }

    if (sortBy === "name") {
      const nameA = (a.name ?? "").toLowerCase();
      const nameB = (b.name ?? "").toLowerCase();
      const cmp = nameA.localeCompare(nameB);
      return sortDir === "asc" ? cmp : -cmp;
    }

    // sort by date
    const da = new Date(a.modified ?? 0).getTime();
    const db = new Date(b.modified ?? 0).getTime();
    return sortDir === "asc" ? db - da : da - db;
  };
}

export function sortFiles(
  files = [],
  sortBy = "name",
  sortDir = "asc",
  foldersMode = "mixed",
) {
  return [...files].sort(createSortComparator(sortBy, sortDir, foldersMode));
}
