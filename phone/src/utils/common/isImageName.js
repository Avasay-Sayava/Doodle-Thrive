const imageExtensionRegex = /\.(jpg|jpeg|png|webp)$/i;

export default function isImageName(name) {
  return !!name && imageExtensionRegex.test(name);
}
