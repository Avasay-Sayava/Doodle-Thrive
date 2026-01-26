import File from "@/src/components/drive/common/File";

export default function FileList({ files, viewMode, sortOptions }) {
  return (
    <>
      {files.map(file => <File file={file} />)}
    </>
  );
}
