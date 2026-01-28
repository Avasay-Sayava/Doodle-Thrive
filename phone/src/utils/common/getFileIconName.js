import isImageName from "@/src/utils/common/isImageName";

export default function getFileIconName(file) {
  if (!file) {
    return "file";
  }

  if (file.type === "file" && isImageName(file.name)) {
    return "image";
  }

  return file.type;
}
