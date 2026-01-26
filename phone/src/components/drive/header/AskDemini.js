import Icon from "@/src/components/common/Icon";
import { TouchableOpacity } from "react-native";

export default function AskDemini({ size, color }) {

    return (
        <TouchableOpacity
            onPress={() => {
                //TODO: Replace alerts with an actual rickroll
                alert("Never gonna give you up, never gonna let you down!");
                alert("Never gonna run around and desert you!");
                alert("Never gonna make you cry, never gonna say goodbye!");
                alert("Never gonna tell a lie and hurt you!");
            }}
        >
            <Icon name="demini" size={size} color={color} />
        </TouchableOpacity>
    );
}