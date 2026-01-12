export default function IconBin({ width = 18, height = 18, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} {...props}>
      <path
        fill="currentColor"
        d="M6 7h12l-1 14H7L6 7Zm3-4h6l1 2h4v2H4V5h4l1-2Z"
      />
    </svg>
  );
}
