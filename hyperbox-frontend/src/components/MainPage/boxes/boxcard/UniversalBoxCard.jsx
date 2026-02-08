import { motion, useMotionValue, useTransform } from "framer-motion";
import React from "react";
import styled, { css } from "styled-components";

// --- Color Helpers ---
const getColor = (colorName) => {
    switch (colorName?.toLowerCase().trim()) {
        case "green": return "#2dfc1a";
        case "blue": return "#2E86C1";
        case "purple": return "#b163da";
        case "red": return "#ef4444";
        case "gold": return "#ffd700";
        case "grey": return "#808080";
        default: return "#2E86C1"; // Default Blue
    }
};

const getRGB = (colorName) => {
    switch (colorName?.toLowerCase().trim()) {
        case "green": return "45, 252, 26";
        case "blue": return "46, 134, 193";
        case "purple": return "177, 99, 218";
        case "red": return "239, 68, 68";
        case "gold": return "255, 215, 0";
        case "grey": return "128, 128, 128";
        default: return "46, 134, 193";
    }
};

// --- Styled Components ---

const CardWrapper = styled.div`
  width: 100%;
  perspective: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

const CardContainer = styled(motion.div)`
  width: 260px;
  min-height: 340px; /* Slightly taller for info */
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: rgba(23, 23, 23, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  /* Dynamic Glow based on Color Prop */
  ${({ color }) => {
    const rgb = getRGB(color);
    return css`
      border-bottom: 3px solid rgba(${rgb}, 1);
      &:hover {
        box-shadow: 0 15px 45px rgba(${rgb}, 0.3);
        border-color: rgba(${rgb}, 0.5);
      }
    `;
  }}
`;

// Chance Overlay (For Items)
const ChanceOverlay = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(0,0,0,0.6);
    border: 1px solid rgba(255,255,255,0.2);
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    z-index: 10;
    backdrop-filter: blur(4px);
    
    span {
        color: ${({ color }) => getColor(color)};
        margin-left: 4px;
    }
`;

const ImageArea = styled.div`
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  position: relative;
  z-index: 2;
`;

const StyledImage = styled(motion.img)`
  max-width: 85%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));
`;

const InfoArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 15px 20px 25px 20px;
  justify-content: space-between;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  margin: 0 0 10px 0;
  letter-spacing: 0.5px;
  line-height: 1.3;
  
  /* Truncate long titles */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`;

const PriceLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2px;
`;

const PriceValue = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: ${({ color }) => getColor(color)};
  text-shadow: 0 0 10px rgba(${({ color }) => getRGB(color)}, 0.4);
`;

const ActionButton = styled.button`
    width: 100%;
    padding: 12px 0;
    border: none;
    border-radius: 30px;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    
    background: ${({ color }) => getColor(color)};
    color: #000;
    box-shadow: 0 4px 15px rgba(${({ color }) => getRGB(color)}, 0.3);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(${({ color }) => getRGB(color)}, 0.5);
        filter: brightness(1.1);
    }

    &:active {
        transform: translateY(0);
    }
`;

// --- Reusable Component ---

export function UniversalBoxCard({
  title,
  price,
  color = "blue",
  img,
  chance, // Optional: Chance percentage (for items)
  onOpen, // Optional: Function (renders button if present)
  items, // Not used directly in UI logic here, but kept for prop compat if needed
}) {
  
  // Framer Motion Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]); // Reduced tilt for subtle feel
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  // Handle Price formatting
  const displayPrice = price ? (String(price).includes('$') ? price : `$${price}`) : null;

  return (
    <CardWrapper>
      <CardContainer
        color={color}
        style={{ x, y, rotateX, rotateY, z: 100 }}
        drag
        dragElastic={0.16}
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ cursor: "grabbing" }}
      >
        {/* Chance Overlay (Top Right) */}
        {chance !== undefined && (
            <ChanceOverlay color={color}>
                CHANCE: <span>{chance}%</span>
            </ChanceOverlay>
        )}

        {/* Image Area */}
        <ImageArea>
          <StyledImage 
            src={img} 
            alt={title} 
            drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            style={{ x, y, rotateX, rotateY, z: 1000 }}
          />
        </ImageArea>

        {/* Information Area */}
        <InfoArea>
            {/* Title */}
            <Title>{title}</Title>

            {/* Price / Value with Label */}
            {displayPrice && (
                <PriceContainer>
                    <PriceLabel>{chance ? "EST. VALUE" : "PRICE"}</PriceLabel>
                    <PriceValue color={color}>{displayPrice}</PriceValue>
                </PriceContainer>
            )}

            {/* Action Button (Condition: if onOpen is passed) */}
            {onOpen && (
                <ActionButton onClick={onOpen} color={color}>
                    Open Box
                </ActionButton>
            )}
        </InfoArea>

      </CardContainer>
    </CardWrapper>
  );
}
