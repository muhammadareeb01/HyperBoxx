import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import api from "../../../../utils/api"; // Your Axios helper
import { useParams } from "react-router-dom"; // To get box ID

// --- STYLED COMPONENTS (Kept mostly the same) ---
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
`;

const SpinnerContainer = styled.div`
  position: relative; width: 80vw; height: 12rem; overflow: hidden;
  background: transparent; display: flex; justify-content: center;
  border: 2px solid #333; border-radius: 10px;
`;

const Box = styled.div`
  position: absolute; top: 0; width: 180px; height: 100%;
  margin: 0 0.5rem; border-radius: 0.8rem;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center;
`;

const ItemImage = styled.img`width: 70%; max-height: 90px; object-fit: contain;`;
const ItemName = styled.p`color: white; font-weight: bold; margin-top: 0.5rem; text-align: center;`;

const VerticalLine = styled.div`
  position: absolute; top: 0; left: 50%; width: 4px; height: 100%;
  background-color: #ffd700; transform: translateX(-50%); z-index: 10;
  box-shadow: 0 0 10px #ffd700;
`;

const SpinButton = styled.button`
  margin-top: 2rem; padding: 1rem 2rem;
  background: ${props => props.disabled ? '#555' : 'linear-gradient(to right, #fc4a1a, #f7b733)'};
  color: #fff; border: none; font-size: 1.5rem; font-weight: bold;
  border-radius: 0.5rem; cursor: pointer;
  &:hover { background: ${props => props.disabled ? '#555' : 'linear-gradient(to right, #e03b14, #f3a31c)'}; }
`;

// --- POPUP STYLES ---
const burstAnimation = keyframes`
  0% { transform: scale(0.5) rotate(0deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.9; }
  100% { transform: scale(1) rotate(360deg); opacity: 1; }
`;
const PrizePopup = styled(motion.div)`
  position: fixed; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  padding: 2rem; border-radius: 1.5rem; text-align: center;
  z-index: 1003; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  border: 4px solid #ffd700; width: 400px; max-height: 70vh;
`;
const PrizeHeader = styled.h2`
  color: #ffd700; font-size: 2rem; font-weight: bold; text-transform: uppercase;
  margin-bottom: 1rem; animation: ${burstAnimation} 0.8s ease-in-out;
`;
const ActionButton = styled.button`
  margin: 0.5rem; padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #4caf50, #45a049);
  color: #fff; border: none; border-radius: 0.5rem;
  font-size: 1.2rem; font-weight: bold; cursor: pointer;
  &:hover { background: linear-gradient(to right, #45a049, #388e3c); }
  &:nth-child(2) { background: linear-gradient(to right, #f44336, #da190b); }
  &:nth-child(2):hover { background: linear-gradient(to right, #da190b, #c62828); }
`;
const ErrorMsg = styled.div`color: #ff4444; margin-top: 10px; font-weight: bold;`;

const HorizontalSpinner = ({ items, onClose }) => {
  const { id: boxId } = useParams(); // Get Box ID from URL
  const containerRef = useRef(null);
  const [boxStates, setBoxStates] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null); // The full winner object
  const [error, setError] = useState(null);

  // Constants for Animation
  const boxWidth = 180 + 16; // width + margin
  const speed = 50; // Pixels per frame initially

  // Initialize the "Strip" of items
  useEffect(() => {
    const repeatedItems = Array(50).fill(items).flat();
    
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth * 0.8;
    const startOffset = 0; 

    const initialStates = repeatedItems.map((item, index) => ({
      ...item, // 1. Spread item properties FIRST
      renderId: `box-${index}`, // 2. Create a specific ID for the loop
      left: startOffset + index * boxWidth,
    }));
    
    setBoxStates(initialStates);
  }, [items]);

  // --- MAIN FUNCTION: SPIN & CALL API ---
  const startSpin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinner(null);
    setError(null);

    // 1. Start Visual Animation (Infinite Loop state)
    let animationId;
    let currentSpeed = speed;
    let stopAnimation = false;

    // The animation loop moves boxes left
    const animate = () => {
      setBoxStates((prev) => {
        return prev.map((box) => {
          let newLeft = box.left - currentSpeed;
          // Loop back logic (Infinite Scroll)
          // If box goes off screen left, move it to the end
          if (newLeft < -boxWidth) {
             const maxLeft = Math.max(...prev.map(b => b.left));
             newLeft = maxLeft + boxWidth;
          }
          return { ...box, left: newLeft };
        });
      });

      if (!stopAnimation) {
        animationId = requestAnimationFrame(animate);
      }
    };
    animationId = requestAnimationFrame(animate);

    try {
      // 2. CALL API (While animation is running)
      // Note: Make sure your Route is exactly /api/game/boxes/:id/open or similar
      const res = await api.post(`/game/boxes/${boxId}/open`);
      const wonItem = res.data.item; // The item object from backend
      
      console.log("Winner determined by Server:", wonItem.name);

      // 3. STOP LOGIC (Snap to Winner)
      // We wait 2 seconds to let the user feel the suspense
      setTimeout(() => {
        stopAnimation = true;
        cancelAnimationFrame(animationId);
        
        // Find the winner visually and display it
        setWinner(wonItem);
        setIsSpinning(false);
      }, 3000);

    } catch (err) {
      console.error(err);
      stopAnimation = true;
      cancelAnimationFrame(animationId);
      setIsSpinning(false);
      
      if (err.response && err.response.data.code === 'LOW_BALANCE') {
        setError("Insufficient Funds!");
      } else {
        setError("Error opening box. Try again.");
      }
    }
  };

  const handleAction = (action) => {
    // Navigate to inventory or reload
    if(action === "Get") {
        window.location.href = '/profile';
    } else {
        // Implement Sell Logic later
        alert("Sell feature coming soon! Item is in your inventory.");
        window.location.href = '/profile';
    }
  };

  return (
    <>
      <Overlay onClick={!isSpinning ? onClose : undefined}>
        <div onClick={(e) => e.stopPropagation()}>
          
          <SpinnerContainer ref={containerRef}>
            {boxStates.map((box) => (
              <Box key={box.renderId} style={{ left: `${box.left}px` }}>
                {/* Use item.image from API */}
                <ItemImage src={box.image} alt={box.name} />
                <ItemName>{box.name}</ItemName>
              </Box>
            ))}
            <VerticalLine />
          </SpinnerContainer>

          <div style={{ textAlign: "center" }}>
             {error && <ErrorMsg>{error}</ErrorMsg>}
            <SpinButton onClick={startSpin} disabled={isSpinning}>
              {isSpinning ? "Spinning..." : "SPIN FOR PRIZE"}
            </SpinButton>
          </div>
        </div>
      </Overlay>

      {/* WINNER POPUP */}
      {winner && (
        <PrizePopup
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <PrizeHeader>YOU WON!</PrizeHeader>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <img src={winner.image} alt={winner.name} style={{ width: '150px', marginBottom: '10px' }} />
            <h3 style={{ color: 'white' }}>{winner.name}</h3>
            <p style={{ color: '#ffd700' }}>Value: ${winner.value}</p>
          </div>
          
          <ActionButton onClick={() => handleAction("Get")}>
            Keep Item
          </ActionButton>
          <ActionButton onClick={() => handleAction("Sell")}>
            Sell for ${winner.value}
          </ActionButton>
        </PrizePopup>
      )}
    </>
  );
};

export default HorizontalSpinner;