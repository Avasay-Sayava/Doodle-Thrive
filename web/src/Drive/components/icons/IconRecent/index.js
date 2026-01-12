export default function IconRecent({ width = 18, height = 18, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} {...props}>
      <path
        fill="currentColor"
        d="M12 2 A10 10 0 1 1 11.999 2 Z M11 7 V13 L16.25 16.15 L17.25 14.42 L13 11.9 V7 H11"
      />
    </svg>
  );
}
