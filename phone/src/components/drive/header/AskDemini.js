import Icon from "@/src/components/common/Icon";
import { TouchableOpacity } from "react-native";

export default function AskDemini({ size, color }) {
  return (
    <TouchableOpacity
      onPress={() => {
        //TODO: Replace alerts with an actual rickroll
      }}
    >
      <Icon name="demini" size={size} color={color} />
    </TouchableOpacity>
  );
}
