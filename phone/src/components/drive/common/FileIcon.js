import { useMemo } from "react";
import Icon from "@/src/components/common/Icon";

function getIconName(file) {
  if (!file) return "file";

  if (file.type === "file" && /^.*\.(jpg|jpeg|png|webp)$/.test(file.name))
    return "image";

  return file.type;
}

export default function FileIcon({ file, size, color }) {
  const iconName = useMemo(() => getIconName(file), [file]);

  return <Icon name={iconName} size={size} color={color} />;
}
