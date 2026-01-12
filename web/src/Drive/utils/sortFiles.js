/**
 * Utility functions for sorting files
 */

function isFolder(x) {
  return x?.type === "folder";
}

/**
 * Create a comparator function for sorting files
 * @param {string} sortBy - "name" or "modified"
 * @param {"asc"|"desc"} sortDir - "asc" or "desc"
 * @param {string} foldersMode - "mixed" or "folders-first"
 * @returns {Function} - Comparator function
 */
export function createSortComparator(sortBy = "name", sortDir = "asc", foldersMode = "mixed") {
  return (a, b) => {
    // Handle folders first mode
    if (foldersMode === "folders-first") {
      const af = isFolder(a);
      const bf = isFolder(b);
      if (af !== bf) return af ? -1 : 1;
    }

    // Sort by name
    if (sortBy === "name") {
      const nameA = (a.name ?? "").toLowerCase();
      const nameB = (b.name ?? "").toLowerCase();
      const cmp = nameA.localeCompare(nameB);
      return sortDir === "asc" ? cmp : -cmp;
    }

    // Sort by modified date
    const da = new Date(a.modified ?? 0).getTime();
    const db = new Date(b.modified ?? 0).getTime();
    return sortDir === "asc" ? db - da : da - db;
  };
}

/**
 * Sort an array of files
 * @param {Array} [files=[]] - Files to sort
 * @param {"name"|"modified"} [sortBy="name"] - "name" or "modified"
 * @param {"asc"|"desc"} [sortDir="asc"] - "asc" or "desc"
 * @param {"mixed"|"folders-first"} [foldersMode="mixed"] - "mixed" or "folders-first"
 * @returns {Array} - Sorted files
 */
export function sortFiles(files = [], sortBy = "name", sortDir = "asc", foldersMode = "mixed") {
  return [...files].sort(createSortComparator(sortBy, sortDir, foldersMode));
}
