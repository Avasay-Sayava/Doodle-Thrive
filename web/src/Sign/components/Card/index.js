import "./style.css";

function Card({ children, className = "", collapsed = false, ...props }) {
    return (
        <div className={`card ${className} ${collapsed ? "collapsed" : ""}`} {...props}>
            {children}
        </div>
    );
}

export default Card;
