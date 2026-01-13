import "./style.css";
import { useRef, useMemo } from "react";
import IconFile from "../../icons/IconFile";
import IconFolder from "../../icons/IconFolder";
import IconUpload from "../../icons/IconUpload";
import GetText from "../../../modals/GetText";
import newFile from "../../../utils/newFile";

export default function ActionsMenu({
  onClose,
  isOpen,
  onCreated,
  folderId = null,
  anchorPoint = null,
}) {
  const openFolderRef = useRef(null);
  const openFileRef = useRef(null);
  const fileInputRef = useRef(null);

  const menuStyle = useMemo(
    () => ({
      left: anchorPoint ? `${anchorPoint.x}px` : "0px",
      top: anchorPoint ? `${anchorPoint.y}px` : "0px",
    }),
    [anchorPoint]
  );

  const refresh = () => {
    onClose?.();
    onCreated?.();
  };

  const create = async (name, fileType) => {
    await newFile({ fileName: name, fileType, parentId: folderId });
    refresh();
  };

  const pickFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    for (const f of files) {
      await newFile({
        fileName: f.name,
        fileType: "file",
        parentId: folderId,
        fileObject: f,
      });
    }
    refresh();
  };

  return (
    <>
      <GetText
        title="New file"
        placeholder="Untitled file"
        submitLabel="Create"
        onSubmit={(name) => create(name, "file")}
      >
        {(open) => {
          openFileRef.current = open;
          return null;
        }}
      </GetText>

      <GetText
        title="New folder"
        placeholder="Untitled folder"
        submitLabel="Create"
        onSubmit={(name) => create(name, "folder")}
      >
        {(open) => {
          openFolderRef.current = open;
          return null;
        }}
      </GetText>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="new-hidden-input"
        onChange={pickFiles}
      />

      {isOpen && (
        <div
          className="new-menu"
          role="menu"
          aria-label="New menu"
          style={menuStyle}
        >
          <button
            type="button"
            className="new-menu-item"
            onClick={() => {
              onClose?.();
              openFileRef.current?.();
            }}
          >
            <span className="new-menu-icon" aria-hidden="true">
              <IconFile />
            </span>
            New file
          </button>

          <button
            type="button"
            className="new-menu-item"
            onClick={() => {
              onClose?.();
              openFolderRef.current?.();
            }}
          >
            <span className="new-menu-icon" aria-hidden="true">
              <IconFolder />
            </span>
            New folder
          </button>

          <div className="new-menu-sep" />

          <button
            type="button"
            className="new-menu-item"
            onClick={() => {
              onClose?.();
              fileInputRef.current?.click();
            }}
          >
            <span className="new-menu-icon" aria-hidden="true">
              <IconUpload />
            </span>
            Upload file
          </button>
        </div>
      )}
    </>
  );
}
