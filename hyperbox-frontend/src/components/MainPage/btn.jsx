import React from "react";
import "../../style/boxcard.css";

function ButtonOpen({ price, name, color }) {
  // 1. SAFELY HANDLE PRICE (Number or String)
  // Convert to string first to avoid ".replace is not a function" error
  const priceString = price ? price.toString() : "0";
  
  // Parse the number for your logic (remove $ if it exists)
  const numericPrice = parseFloat(priceString.replace("$", "").replace(",", ""));

  // 2. DETERMINE CLASS BASED ON PRICE
  let buttonStyleClass = "";
  if (numericPrice >= 0.01 && numericPrice <= 0.99) {
    buttonStyleClass = "grey";
  } else if (numericPrice >= 1.0 && numericPrice <= 9.99) {
    buttonStyleClass = "green";
  } else if (numericPrice >= 10.0 && numericPrice <= 49.99) {
    buttonStyleClass = "blue";
  } else if (numericPrice >= 50.0 && numericPrice <= 99.99) {
    buttonStyleClass = "purple";
  } else if (numericPrice >= 100.0 && numericPrice <= 999.99) {
    buttonStyleClass = "red";
  } else if (numericPrice >= 1000.0) {
    buttonStyleClass = "gold";
  }

  // Ensure we display a "$" sign if the API didn't send one
  const displayPrice = priceString.includes('$') ? priceString : `$${priceString}`;

  return (
    <div className={`open-box-btn ${buttonStyleClass}`}>
      {/* Removed <Link> here because BoxCard already wraps this in a Link.
         Nested Links (<a> inside <a>) cause React errors.
      */}
      <button className="button-open">OPEN {displayPrice}</button>
      
      <div className="space">
        <span style={{ "--i": 31 }} className="star"></span>
        <span style={{ "--i": 12 }} className="star"></span>
        <span style={{ "--i": 57 }} className="star"></span>
        <span style={{ "--i": 93 }} className="star"></span>
        <span style={{ "--i": 23 }} className="star"></span>
        <span style={{ "--i": 70 }} className="star"></span>
        <span style={{ "--i": 6 }} className="star"></span>
      </div>
    </div>
  );
}

export default ButtonOpen;