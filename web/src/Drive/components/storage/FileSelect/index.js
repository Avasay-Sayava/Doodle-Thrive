import "./style.css";
import { useEffect, useState } from "react";
import setStarred from "../../../utils/setStarred";
import downloadFile from "../../../utils/downloadFile";
import renameFile from "../../../utils/renameFile";
import GetText from "../../../modals/GetText";
import FileActions from "../FileActions";
import ShareDialog from "../../../modals/ShareDialog";

function FileSelect({ file, onRefresh }) {
  const { id, starred } = file;

  const [isStarred, setIsStarred] = useState(Boolean(starred));

  useEffect(() => {
    setIsStarred(Boolean(starred));
  }, [starred]);

  const onToggleStar = async (e) => {
    e.stopPropagation();

    const next = !isStarred;
    setIsStarred(next);

    try {
      await setStarred(id, next);
    } catch (err) {
      setIsStarred(!next);
      console.error("Failed to update starred:", err);
    }
  };

  return (
    <div className="file-actions">
      <ShareDialog file={file} onRefresh={onRefresh}>
        {(open) => (
          <button
            className="file-action-btn file-action-btn--hover"
            title="Share"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.5 2.5 0 0 0 0-1.39l7.02-4.11A2.99 2.99 0 1 0 14 5a2.5 2.5 0 0 0 .04.39L7.02 9.5a3 3 0 1 0 0 5l7.02 4.11c-.03.12-.04.25-.04.39a3 3 0 1 0 3-2.92Z"
              />
            </svg>
          </button>
        )}
      </ShareDialog>

      <button
        className="file-action-btn file-action-btn--hover"
        title="Download"
        onClick={() => downloadFile(id)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M5 20h14v-2H5v2Zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1Z"
          />
        </svg>
      </button>

      <GetText
        title="Rename"
        placeholder="New name"
        submitLabel="Rename"
        onSubmit={(newName) =>
          renameFile(id, newName).then(() => onRefresh?.())
        }
      >
        {(open) => (
          <button
            className="file-action-btn file-action-btn--hover"
            title="Rename"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18.71-11.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 2-1.66Z"
              />
            </svg>
          </button>
        )}
      </GetText>

      {isStarred && (
        <button
          className="file-action-btn file-action-btn--starred"
          title="Unstar"
          onClick={onToggleStar}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
            />
          </svg>
        </button>
      )}
      {!isStarred && (
        <button
          className={`file-action-btn file-action-btn--hover ${
            isStarred ? "file-action-btn--starred" : ""
          }`}
          title={isStarred ? "Unstar" : "Star"}
          onClick={onToggleStar}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
            />
          </svg>
        </button>
      )}

      <FileActions file={file} onRefresh={onRefresh} openOnLeftClick>
        <button
          className="file-action-btn"
          title="More"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
            />
          </svg>
        </button>
      </FileActions>
    </div>
  );
}

export default FileSelect;
