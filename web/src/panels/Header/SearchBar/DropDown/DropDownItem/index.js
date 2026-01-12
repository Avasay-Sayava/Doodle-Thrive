import './style.css';
import IconFile from '../../../../../Drive/components/icons/IconFile';
import IconFolder from '../../../../../Drive/components/icons/IconFolder';
import { useNavigate } from 'react-router-dom';

function DropDownItem({ item, type, setOpen }) {
    const navigate = useNavigate();
    const icon = type === 'folder' ? <IconFolder /> : <IconFile />;
    
    const onClick = () => {
        if (type === 'folder') {
            navigate(`/drive/folders/${item.id}`, { replace: true });
            setOpen(false);
        } else {
            // TODO: Handle file click (e.g., open file details modal)
        }
    };

    return (
        <div onClick={() => onClick()} className="search-dropdown-item">
            <span className="file-icon">{icon}</span>
            <span className="item-name">{item.name}</span>
        </div>
    );
}

export default DropDownItem;
