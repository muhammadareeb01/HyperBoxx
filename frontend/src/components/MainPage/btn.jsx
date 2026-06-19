import React from "react";
import "../../style/boxcard.css";

function ButtonOpen({ price, name, color }) {
  // 1. SAFELY HANDLE PRICE
  // Ensure we have a string
  const priceString = (price !== undefined && price !== null) ? String(price) : "0";
  
  // Create display price string - add $ if missing
  const displayPrice = priceString.includes('$') ? priceString : `$${priceString}`;
  
  // Calculate numeric price for potential logic (currently handled by parent CSS themes)
  const numericPrice = parseFloat(priceString.replace("$", "").replace(",", ""));
  
  // Note: The specific color class (green, blue, etc.) is now primarily handled 
  // by the parent .e-card class in the updated CSS design, but we can keep 
  // logic here if we wanted button-specific overrides. 
  // For now, we rely on the parent's coloring context.

  return (
    <div className="open-box-btn">
      <button className="button-open">OPEN {displayPrice}</button>
    </div>
  );
}

export default ButtonOpen;