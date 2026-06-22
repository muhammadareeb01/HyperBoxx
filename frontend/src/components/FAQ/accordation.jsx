import React, { useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import "./faq.css";
const Accordion = ({ question, answer, border, id }) => {
  const [isActive, setIsActive] = useState(false);
  const borderColors = border.split(" ");
  const style = {
    borderLeft: `2px solid rgb(${borderColors[0]}, ${borderColors[1]}, ${borderColors[2]})`,
    boxShadow: `inset 10px   0px 20px rgba(${borderColors[0]}, ${borderColors[1]}, ${borderColors[2]}, 0.3)`,
  };

  return (
    <div className="accordion-item" style={style}>
      <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div className="question">
          <h3 style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span className="faqnumber"> {id} </span>
            <span style={{ marginLeft: "15px", flex: 1, lineHeight: "1.4" }}>{question}</span>
          </h3>
        </div>
        {isActive ? (
          <div className="up">
            {" "}
            <ArrowUpwardIcon sx={{ color: "white" }} className="up" />{" "}
          </div>
        ) : (
          <div>
            {" "}
            <ArrowDownwardIcon sx={{ color: `${border}` }} className="down" />
          </div>
        )}
      </div>
      <div className={`accordion-content ${isActive ? "open" : ""}`}>
        <div className="answer-wrapper">
          <div className="answer">
            <h3> {answer} </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
