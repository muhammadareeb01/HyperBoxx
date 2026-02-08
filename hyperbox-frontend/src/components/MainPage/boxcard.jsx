import React from 'react';
import { Link } from 'react-router-dom';
import '../../style/boxcard.css';

const BoxCard = ({ box }) => {
    // 1. Calculate Price for logic
    const priceString = (box.price !== undefined && box.price !== null) ? String(box.price) : "0";
    const numericPrice = parseFloat(priceString.replace("$", "").replace(",", ""));
    const displayPrice = priceString.includes('$') ? priceString : `$${priceString}`;

    // 2. Determine Color Class based on Price
    // Logic: 
    // < $10: Green
    // $10 - $49: Blue
    // $50 - $99: Purple
    // $100 - $999: Red (Premium)
    // >= $1000: Gold
    let boxColor = "green"; // default low tier
    
    if (numericPrice >= 1000) {
        boxColor = "gold";
    } else if (numericPrice >= 100) {
        boxColor = "red"; 
    } else if (numericPrice >= 50) {
        boxColor = "purple";
    } else if (numericPrice >= 10) {
        boxColor = "blue";
    }

    return (
        <div className={`subbox ${boxColor}`}>
            <div className={`e-card ${boxColor}`}>
                
                {/* 1. IMAGE CONTAINER - Fixed Size & Centered */}
                <div className="image-container">
                    <img 
                        src={box.image} 
                        alt={box.name} 
                        className="box-image"
                    />
                </div>

                {/* Background Effects */}
                <div className="wave"></div>
                <div className="wave"></div>

                <div className="info-container">
                    {/* 2. TITLE */}
                    <span className="box-title">{box.name || box.title}</span>
                    
                    {/* 3. PRICE */}
                    <span className="box-price">{displayPrice}</span>

                    {/* 4. BUTTON */}
                    <Link to={`/box/${box.id}`} className="box-link">
                        <button className="open-btn">OPEN BOX</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BoxCard;