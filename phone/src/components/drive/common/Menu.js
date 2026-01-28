import PopupModal from "./PopupModal";
import { useRouter } from "expo-router";

export default function Menu() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);

    const openRecent = () => {
        router.replace("(drive)/(screens)/recent");
    };
    const openTrashed = () => {
        router.replace("(drive)/(screens)/trashed");
    };
    const openSettings = () => {
        router.replace("(drive)/(screens)/settings");
    };


    return (
        <PopupModal isOpen={isOpen} onClose={onClose}>
            <View>
                <TouchableOpacity onPress={openRecent}>Recent</TouchableOpacity>
                <TouchableOpacity onPress={openTrashed}>Trashed</TouchableOpacity>
                <TouchableOpacity onPress={openSettings}>Settings</TouchableOpacity>
            </View>
        </PopupModal>
    )
}