const imageExtensionRegex = /\.(jpg|jpeg|png|webp)$/i;

export default function getFileIconName(file) {
  if (!file) {
    return "file";
  }

  if (file.type === "file" && imageExtensionRegex.test(file.name)) {
    return "image";
  }

  return file.type;
}
