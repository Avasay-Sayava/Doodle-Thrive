import "./style.css";

function FileSelect() {
  return (
    <div className="file-actions">
      {/* Share */}
      <button className="file-action-btn" title="Share">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="currentColor"
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.5 2.5 0 0 0 0-1.39l7.02-4.11A2.99 2.99 0 1 0 15 5a3 3 0 0 0 .05.52L8.03 9.63a3 3 0 1 0 0 4.74l7.02 4.11c-.03.17-.05.34-.05.52a3 3 0 1 0 3-3Z"
          />
        </svg>
      </button>

      {/* Download */}
      <button className="file-action-btn" title="Download">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="currentColor"
            d="M5 20h14v-2H5v2Zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1Z"
          />
        </svg>
      </button>

      {/* Rename */}
      <button className="file-action-btn" title="Rename">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="currentColor"
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18.71-11.04a1 1 0 0 0 0-1.41l-2.5-2.5a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.99-1.67Z"
          />
        </svg>
      </button>

      {/* Star */}
      <button className="file-action-btn" title="Star">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="currentColor"
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
          />
        </svg>
      </button>

      {/* More */}
      <button className="file-action-btn" title="More">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="currentColor"
            d="M12 8a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"
          />
        </svg>
      </button>
    </div>
  );
}

export default FileSelect;
