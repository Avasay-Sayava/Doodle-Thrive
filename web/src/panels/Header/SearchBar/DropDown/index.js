import './style.css';

import DropDownItem from './DropDownItem';

function DropDown({ results = [], loading}) {
    if (loading) {
        return (
            <div className="search-dropdown">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '60px' }}>
                    Searching…
                </div>
            </div>
        );
    }

    if (!results.length) {
        return (
            <div className="search-dropdown">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '60px' }}>
                    No results found
                </div>
            </div>
        );
    }

    return (
        <div className="search-dropdown">
            {results.map((item) => (
                <DropDownItem item={item} type={item.type} />
            ))}
        </div>
    );
}

export default DropDown;