export default function IconUpload({ width = 18, height = 18, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} {...props}>
      <path
        fill="currentColor"
        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
      />
    </svg>
  );
}
