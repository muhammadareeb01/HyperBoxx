import React from "react";
import styled from "styled-components";

const DetailsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2.5em 6px 10px 6px;
  line-height: 1.4;
`;

const MediumText = styled.span`
  font-size: 13px;
  color: #fff;
  padding: 5px 0px;
  font-weight: 800;
  text-transform: uppercase;
`;

const SpacedHorizontalContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BuyButton = styled.button`
  padding: 6px 8px;
  background-color: #fbbe01;
  color: #000;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 700;
  border: 3px solid transparent;
  outline: none;
  cursor: pointer;
  margin: auto;
  transition: all 290ms ease-in-out;
  border-radius: 8px;

  &:hover {
    background-color: transparent;
    color: #fff;
    border: 3px solid #fbbe01;
  }
`;

export function BoxDetails({ price, title, onOpen }) {
  return (
    <DetailsContainer>
      <SpacedHorizontalContainer>
        <MediumText>{title}</MediumText>
        <MediumText>{price}</MediumText>
      </SpacedHorizontalContainer>
      <SpacedHorizontalContainer>
        <BuyButton onClick={onOpen}>OPEN BOX</BuyButton>
      </SpacedHorizontalContainer>
    </DetailsContainer>
  );
}
