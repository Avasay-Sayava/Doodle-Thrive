import react from 'react';

import './style.css';
import IconDrive from './IconDrive';
import IconFolder from './IconFolder';

function DropDownItem({ item, type }) {
    const icon = type === 'folder' ? <IconFolder /> : <IconDrive />;
    
    return (
        <div className="search-dropdown-item">
            {icon}
            <span className="item-name">{item.name || item.id}</span>
        </div>
    );
}

export default DropDownItem;