import PopupModal from "./PopupModal";

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);

    return (
        <PopupModal isOpen={isOpen} onClose={onClose}>
            
        </PopupModal>
    )
}