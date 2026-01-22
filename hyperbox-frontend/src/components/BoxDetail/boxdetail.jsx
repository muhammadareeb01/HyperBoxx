import React, { useEffect, useState } from "react";
import "../../style/boxlistStyle.css";
import { NikeCard } from "../MainPage/boxes/boxcard/boxcard";
import { ItemWin } from "../MainPage/boxes/boxcard/winning-items";
import "aos/dist/aos.css";
import AOS from "aos";
import { useParams } from "react-router-dom";
import HorizontalSpinner from "../MainPage/boxes/WheelSpinner/wheelspinner";
import api from "../../utils/api"; // Your Axios helper

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

  // Determine colors (Use default blue if API doesn't send color)
  const boxColor = box.color || "blue";
  const arrowColor = colorMap[boxColor] || colorMap.default;

  return (
    <>
      <div className="boxinfo-list-maindiv">
        
        {/* --- 1. BOX INFO CARD --- */}
        <div style={{ margin: "auto" }}>
          <NikeCard
            title={box.name || box.title} // API might send 'name' or 'title'
            price={box.price}
            color={boxColor}
            img={box.image}
            items={items}        // Pass the fetched items
            onOpen={handleOpenBox}
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
              <ItemWin
                title={item.name}
                itemImage={item.image} // Use image from individual item API
                color={boxColor}
                chance={item.chance}
                price={item.value} // Pass value to show price if component supports it
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- 4. GAME SPINNER --- */}
      {showSpinner && (
        <HorizontalSpinner
          items={items} // Pass dynamic items to spinner
          onClose={handleCloseSpinner}
          color={arrowColor}
        />
      )}
    </>
  );
};

export default BoxDetails;