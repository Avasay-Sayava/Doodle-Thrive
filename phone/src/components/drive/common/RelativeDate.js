import { useState, useEffect } from "react";

function getDate(timestamp) {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Unknown";

  const now = new Date();
  const diff = Math.abs(now - date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours < 24 && date.getDate() === now.getDate()) {
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export default function RelativeDate({ timestamp }) {
  const [displayDate, setDisplayDate] = useState(() => getDate(timestamp));

  useEffect(() => {
    setDisplayDate(getDate(timestamp));

    const interval = setInterval(() => {
      setDisplayDate(getDate(timestamp));
    }, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <>{displayDate}</>;
}
