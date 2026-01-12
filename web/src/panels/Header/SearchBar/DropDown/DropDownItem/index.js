import './style.css';
import IconFile from '../../../../../Drive/components/icons/IconFile';
import IconFolder from '../../../../../Drive/components/icons/IconFolder';

function DropDownItem({ item, type }) {
    const icon = type === 'folder' ? <IconFolder /> : <IconFile />;
    
    return (
        <div className="search-dropdown-item">
            <span className="file-icon">{icon}</span>
            <span className="item-name">{item.name}</span>
        </div>
    );
}

export default DropDownItem;
