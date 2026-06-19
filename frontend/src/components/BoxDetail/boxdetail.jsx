import React, { useEffect, useState } from "react";
import "../../style/boxlistStyle.css";
// import { NikeCard } from "../MainPage/boxes/boxcard/boxcard"; // OLD
// import { ItemWin } from "../MainPage/boxes/boxcard/winning-items"; // OLD
import { UniversalBoxCard } from "../MainPage/boxes/boxcard/UniversalBoxCard"; // NEW
import "aos/dist/aos.css";
import AOS from "aos";
import { useParams } from "react-router-dom";
import HorizontalSpinner from "../MainPage/boxes/WheelSpinner/wheelspinner";
import api from "../../utils/api";

// Color mapping for consistency
const colorMap = {
  green: "#2dfc1a",
  blue: "#2E86C1",
  purple: "#b163da",
  grey: "#808080",
  default: "#2dfc1a",
};

const BoxDetails = () => {
  // 1. Get the ID from the URL (MainPage links to /box/:id now)
  const { id } = useParams();

  // 2. State to store API Data
  const [box, setBox] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);

  // 3. Initialize Animations
  useEffect(() => {
    AOS.init({ delay: 700, duration: 800 });
  }, []);

  // 4. Fetch Data from API
  useEffect(() => {
    const fetchBoxAndItems = async () => {
      try {
        setLoading(true);
        // Parallel Fetch: Get Box Info AND Items at the same time
        const [boxRes, itemsRes] = await Promise.all([
          api.get(`/boxes/${id}`),       // Get Box Details (Title, Image, Price)
          api.get(`/boxes/${id}/items`)  // Get Items List
        ]);

        setBox(boxRes.data);
        setItems(itemsRes.data);
      } catch (error) {
        console.error("Error loading box:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxAndItems();
  }, [id]);

  const handleOpenBox = () => {
    setShowSpinner(true);
  };

  const handleCloseSpinner = () => {
    setShowSpinner(false);
  };

  if (loading) {
    return (
      <div className="boxinfo-list-maindiv" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2 style={{ color: "white" }}>Loading Box...</h2>
      </div>
    );
  }

  if (!box) {
    return <div className="boxinfo-list-maindiv">Box not found</div>;
  }

  // Determine colors consistent with Main Page
  const priceString = (box.price !== undefined && box.price !== null) ? String(box.price) : "0";
  const numericPrice = parseFloat(priceString.replace("$", "").replace(",", ""));
  
  let calculatedColor = "green";
  if (numericPrice >= 1000) {
      calculatedColor = "gold";
  } else if (numericPrice >= 100) {
      calculatedColor = "red"; 
  } else if (numericPrice >= 50) {
      calculatedColor = "purple";
  } else if (numericPrice >= 10) {
      calculatedColor = "blue";
  }

  // Use API color if explicitly set, otherwise use calculated price color
  const boxColor = box.color || calculatedColor;
  const arrowColor = colorMap[boxColor] || colorMap.default;

  return (
    <>
      <div className="boxinfo-list-maindiv">
        
        {/* --- 1. BOX INFO CARD (New Universal Component) --- */}
        <div style={{ margin: "auto", padding: "20px 0" }}>
          <UniversalBoxCard
            title={box.name || box.title}
            price={box.price}
            color={boxColor}
            img={box.image}
            onOpen={handleOpenBox} // Passing onOpen renders the 'Open Box' button
          />
        </div>

        {/* --- 2. ITEMS HEADER --- */}
        <div>
          <div className="item-in-the-list">
            <div
              className="thin-line-left"
              data-aos="fade-right"
              data-aos-delay="300"
            ></div>
            <h2 className="list-items-heading">ITEMS IN THIS BOX</h2>
            <div
              className="thin-line-right"
              data-aos="fade-left"
              data-aos-delay="300"
            ></div>
          </div>
        </div>

        {/* --- 3. ITEMS GRID --- */}
        <div
          className="winning-items"
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            flexWrap: "wrap", 
            gap: "20px", 
            padding: "20px" 
          }}
        >
          {items.map((item, index) => (
            <div key={item.id || index}>
              {/* Reuse UniversalBoxCard for Items */}
              <UniversalBoxCard
                title={item.name}
                img={item.image}
                color={boxColor} // Match box theme
                price={item.value} // Show estimated value
                chance={item.chance} // Show win chance
                // No onOpen prop here, so button won't render
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- 4. GAME SPINNER --- */}
      {showSpinner && (
        <HorizontalSpinner
          items={items}
          onClose={handleCloseSpinner}
          color={arrowColor}
        />
      )}
    </>
  );
};

export default BoxDetails;