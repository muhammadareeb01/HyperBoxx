// ItemWin.jsx
import { motion, useMotionValue, useTransform } from "framer-motion";
import React from "react";
import styled from "styled-components";
// Assuming this component exists in your project structure
import { ShoesDetails } from "./winning-items-detail"; 

const CardWrapper = styled.div`
  width: 100%;
  perspective: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContainer = styled(motion.div)`
  width: 200px;
  height: 250px;
  display: flex;
  flex-direction: column;
  border-radius: 25px;
  box-shadow: 0 2px 15px 3px
    ${({ color }) => {
      const safeColor = color?.toLowerCase().trim();
      switch (safeColor) {
        case "green":
          return "rgba(0, 255, 0, 0.3)";
        case "blue":
          return "rgba(0, 128, 255, 0.3)";
        case "purple":
          return "rgba(128, 0, 255, 0.3)";
        case "grey":
          return "rgba(128, 128, 128, 0.3)";
        default:
          return "rgba(255, 255, 255, 0.1)";
      }
    }};
  background-color: #1d1f21;
  color: #fff;
  position: relative;
  cursor: grab;
  overflow: hidden;
  transition: backdrop-filter 0.3s ease-in-out;

  /* --- DYNAMIC WIN CHANCE HOVER --- */
  &::after {
    /* FIX: Removed *100. We assume data comes in as 50, 20, etc. */
    /* Checks if chance exists, if not defaults to 0 */
    content: "Win Chance: ${(props) => props.chance || 0}%";
    
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #1d1f21; /* Dark text for contrast against yellow */
    background-color: #fbbe01;
    height: 0;
    line-height: 5em;
    transition: height 0.3s ease-in-out;
    z-index: 9999;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 14px; /* Increased slightly for readability */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    backdrop-filter: blur(10px);
    &::after {
      height: 4em; /* Height of the hover bar */
    }
  }
`;

const CircleWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  overflow: hidden;
  border-top-right-radius: 25px;
`;

const Circle = styled.div`
  position: absolute;
  width: 240px;
  height: 240px;
  top: -4.2em;
  right: -10em;
  z-index: -3;
  background-color: #fbbe01;
  border-radius: 50%;
`;

const TopContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1.2;
  position: relative;
  align-items: center;
  justify-content: flex-end;
  padding: 1em 15px;
`;

const BottomContainer = styled.div`
  display: flex;
  flex: 0.8;
  padding: 0 1em;
  width: 100%;
`;

const NikeText = styled.h1`
  color: #fff;
  text-transform: uppercase;
  margin: 0;
  z-index: 1;
  font-size: 22px; /* Adjusted font size to fit long names */
  font-weight: 900;
  text-align: center;
  margin-top: 10px;
`;

const ShoesWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const Shoes = styled(motion.div)`
  width: auto;
  height: 120px;
  z-index: 999;
  user-select: none;
  margin-top: 2em; /* Moved up slightly */

  img {
    width: auto;
    height: 100%;
    user-select: none;
    object-fit: contain;
    filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5)); /* Adds nice depth */
  }
`;

export function ItemWin({ title, color, items, itemImage, chance }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  return (
    <CardWrapper>
      {/* Passing chance prop here is crucial for styled-components to read it */}
      <CardContainer color={color} chance={chance}>
        <TopContainer>
          <CircleWrapper>
            <Circle />
          </CircleWrapper>
          <ShoesWrapper>
            <Shoes
              style={{
                x,
                y,
                rotateX,
                rotateY,
                rotate: "-15deg",
                z: 100000,
              }}
              drag
              dragElastic={0.12}
              whileTap={{ cursor: "grabbing" }}
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }} // Resets position after drag
            >
              <img src={itemImage} alt={title} />
            </Shoes>
          </ShoesWrapper>
          <NikeText>{title}</NikeText>
        </TopContainer>
        
        <BottomContainer>
           {/* Passing simple props to details if needed, or remove items prop if unused */}
          <ShoesDetails title={title} /> 
        </BottomContainer>
      </CardContainer>
    </CardWrapper>
  );
}