import FileList from "@/src/components/drive/common/FileList";

const files = [
  {
    id: "",
    name: "NAME",
    type: "folder",
    starred: true,
    owner: "ere",
    modified: 1769381127183
  }
]

export default function Home() {
  return <FileList files={files} />;
}
