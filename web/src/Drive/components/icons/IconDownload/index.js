export default function IconDownload({ width = 18, height = 18, ...props }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M5 20h14v-2H5v2Zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1Z"
      />
    </svg>
  );
}
