import React from "react";
import styled from "styled-components";

const DetailsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2.5em 6px 0 6px;
  line-height: 1.4;
`;

const MediumText = styled.span`
  font-size: 13px;
  color: #fff;
  padding: 5px 0px;
  font-weight: 800;
  text-transform: uppercase;
`;

const SmallText = styled.span`
  font-size: 10px;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
`;

const SpacedHorizontalContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemsList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 10px 0;
`;

const Item = styled.li`
  font-size: 10px;
  color: #ccc;
  text-transform: uppercase;
`;

export function ShoesDetails({ title, price, items }) {
  return (
    <DetailsContainer>
      <SmallText>{title}</SmallText>
      <SpacedHorizontalContainer>
        <MediumText>{price}</MediumText>
      </SpacedHorizontalContainer>
    </DetailsContainer>
  );
}
