import "./style.css";

import DropDownItem from "./DropDownItem";

function DropDown({ results = [], loading, setOpen }) {
  if (loading) {
    return (
      <div className="search-dropdown">
        <div className="search-dropdown-placeholder">Searching…</div>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="search-dropdown">
        <div className="search-dropdown-placeholder">No results found</div>
      </div>
    );
  }

  return (
    <div className="search-dropdown">
      {results.map((item) => (
        <DropDownItem
          key={item.id}
          item={item}
          type={item.type}
          setOpen={setOpen}
        />
      ))}
    </div>
  );
}

export default DropDown;
