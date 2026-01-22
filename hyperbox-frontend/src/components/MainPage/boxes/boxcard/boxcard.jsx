import { motion, useMotionValue, useTransform } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { BoxDetails } from "./boxdetail";

const CardWrapper = styled.div`
  width: 100%;
  perspective: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContainer = styled(motion.div)`
  width: 250px;
  height: 300px;
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
  color: #fff;
  position: relative;
  cursor: grab;
  overflow: hidden;
  transition: backdrop-filter 0.3s ease-in-out;

  &:hover {
    backdrop-filter: blur(100px);
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
  width: 260px;
  height: 260px;
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
`;

const NikeText = styled.h1`
  color: #fff;
  text-transform: uppercase;
  margin: 0;
  z-index: 1;
  font-size: 30px;
  font-weight: 900;
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
  height: 150px;
  z-index: 999;
  user-select: none;
  margin-top: 4em;

  img {
    width: auto;
    height: 100%;
    user-select: none;
  }
`;

export function NikeCard({
  title,
  price,
  color,
  img,
  items,
  itemImage,
  onOpen,
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  return (
    <CardWrapper>
      <CardContainer
        color={color}
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        whileTap={{ cursor: "grabbing" }}
      >
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
                rotate: "-25deg",
                z: 100000,
              }}
              drag
              dragElastic={0.12}
              whileTap={{ cursor: "grabbing" }}
            >
              <img src={img} alt={title} />
            </Shoes>
          </ShoesWrapper>
          <NikeText>{title}</NikeText>
        </TopContainer>
        <BottomContainer>
          <BoxDetails
            price={price}
            title={title}
            color={color}
            onOpen={onOpen}
          />
        </BottomContainer>
      </CardContainer>
    </CardWrapper>
  );
}
