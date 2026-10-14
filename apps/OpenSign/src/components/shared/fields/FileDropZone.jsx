import { useRef, useState } from "react";

export const isFileAccepted = (file, accept) => {
  const entries = (accept || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (entries.length === 0) return true;
  const type = (file?.type || "").toLowerCase();
  const name = (file?.name || "").toLowerCase();
  return entries.some((entry) => {
    if (entry.startsWith(".")) return name.endsWith(entry);
    if (entry.endsWith("/*")) return type.startsWith(entry.slice(0, -1));
    return type === entry;
  });
};

function FileDropZone({
  accept = "",
  onFiles,
  onReject,
  disabled = false,
  children,
  className = ""
}) {
  const [dragging, setDragging] = useState(false);
  const counter = useRef(0);

  const handleEnter = (e) => {
    e.preventDefault();
    if (disabled) return;
    counter.current += 1;
    setDragging(true);
  };
  const handleOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setDragging(true);
  };
  const handleLeave = (e) => {
    e.preventDefault();
    counter.current = Math.max(0, counter.current - 1);
    if (counter.current === 0) setDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    counter.current = 0;
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer?.files || []);
    const accepted = [];
    const rejected = [];
    files.forEach((f) =>
      (isFileAccepted(f, accept) ? accepted : rejected).push(f)
    );
    if (accepted.length > 0 && onFiles) onFiles(accepted);
    if (rejected.length > 0 && onReject) onReject(rejected);
  };

  return (
    <div
      role="region"
      aria-label="File drop zone"
      data-dragging={dragging ? "true" : "false"}
      onDragEnter={handleEnter}
      onDragOver={handleOver}
      onDragLeave={handleLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-box transition-colors ${
        dragging ? "border-primary bg-base-200" : "border-base-content/30"
      } ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export default FileDropZone;
