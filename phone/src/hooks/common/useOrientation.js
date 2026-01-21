import { useWindowDimensions } from "react-native";

/** @return {"portrait"|"landscape"} */
export function useOrientation() {
  const { height, width } = useWindowDimensions();
  const { PORTRAIT, LANDSCAPE } = Orientation;

  return height > width ? PORTRAIT : LANDSCAPE;
}

export const Orientation = {
  PORTRAIT: "portrait",
  LANDSCAPE: "landscape",
};
