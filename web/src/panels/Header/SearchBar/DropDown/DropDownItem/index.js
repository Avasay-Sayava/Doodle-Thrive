import "./style.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFilePermissions, {
  roleFromPermissions,
} from "../../../../../Drive/utils/useFilePermissions";
import useUserId from "../../../../../Drive/utils/useUserId";
import { getFileIcon } from "../../../../../Drive/utils/getFileIcon";

function DropDownItem({ item, type, setOpen }) {
  const navigate = useNavigate();
  const currentUserId = useUserId();
  const { currentUserPerms, loadShared } = useFilePermissions(
    item?.id,
    currentUserId,
  );
  const [canEdit, setCanEdit] = useState(true);

  useEffect(() => {
    if (!item?.id || (type !== "file" && type !== "folder")) return;
    loadShared().catch(() => {});
  }, [item?.id, type, loadShared]);

  useEffect(() => {
    const role = roleFromPermissions(currentUserPerms);
    setCanEdit(["editor", "admin", "owner"].includes(role));
  }, [currentUserPerms]);

  const icon = getFileIcon(type, item.name, item.trashed, canEdit);

  const onClick = () => {
    if (type === "folder") {
      navigate(`/drive/folders/${item.id}`, { replace: true });
      setOpen(false);
    } else {
      navigate(`/drive/search?query=${encodeURIComponent(item.name)}`, {
        replace: true,
        state: { openFileId: item.id },
      });
      setOpen(false);
    }
  };

  return (
    <div onClick={() => onClick()} className="search-dropdown-item">
      <span className="file-icon">{icon}</span>
      <span className="item-name">{item.name}</span>
    </div>
  );
}

export default DropDownItem;
