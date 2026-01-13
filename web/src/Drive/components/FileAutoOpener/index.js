import { useEffect, useState } from "react";
import useUserId from "../../utils/useUserId";
import useFilePermissions, { roleFromPermissions } from "../../utils/useFilePermissions";
import EditFile from "../../modals/EditFile";
import ViewFile from "../../modals/ViewFile";

/**
 * FileAutoOpener - Automatically opens a file in the appropriate modal based on permissions
 * @param {Object} file - The file to open
 * @param {Function} onDone - Callback when file is opened
 */
export default function FileAutoOpener({ file, onDone }) {
    const currentUserId = useUserId();
    const { currentUserPerms, loadShared, loading } = useFilePermissions(file?.id, currentUserId);
    const [opened, setOpened] = useState(false);
    const [openFn, setOpenFn] = useState(null);

    useEffect(() => {
        if (file?.id) {
            loadShared().catch(() => {});
        }
    }, [file?.id, loadShared]);

    useEffect(() => {
        if (!openFn || opened || loading) return;
        setOpened(true);
        openFn();
        onDone?.();
    }, [openFn, opened, loading, onDone]);

    const role = roleFromPermissions(currentUserPerms);
    const canEdit = ["editor", "admin", "owner"].includes(role);

    if (canEdit) {
        return (
            <EditFile file={file}>
                {(open) => {
                    if (!openFn) setOpenFn(() => open);
                    return null;
                }}
            </EditFile>
        );
    }

    return (
        <ViewFile file={file}>
            {(open) => {
                if (!openFn) setOpenFn(() => open);
                return null;
            }}
        </ViewFile>
    );
}
