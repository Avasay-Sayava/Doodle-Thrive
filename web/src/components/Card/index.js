import { forwardRef } from "react";
import "./style.css";

/**
 * Card - reusable component with open/close animations
 * @param {boolean} isOpen - whether the card is open (visible with full opacity)
 * @param {string} className - additional CSS classes
 */
const Card = forwardRef(({ children, className = "", isOpen = true, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={`card ${className} ${isOpen ? "open" : "closed"}`} 
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
