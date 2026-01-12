import './style.css';

import DropDownItem from './DropDownItem';

function DropDown({ results = [], loading}) {
    if (loading) {
        return <div className="search-dropdown">Searching…</div>;
    }

    if (!results.length) {
        return <div className="search-dropdown">No results found</div>;
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