import React, { useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import "./faq.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Accordion = ({ question, answer, border, id }) => {
  const [isActive, setIsActive] = useState(false);
  const borderColors = border.split(" ");
  const style = {
    borderLeft: `2px solid rgb(${borderColors[0]}, ${borderColors[1]}, ${borderColors[2]})`,
    boxShadow: `inset 10px   0px 20px rgba(${borderColors[0]}, ${borderColors[1]}, ${borderColors[2]}, 0.3)`,
  };

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);
  return (
    <div className="accordion-item" style={style} data-aos="fade-right">
      <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div className="question">
          <h3>
            {" "}
            <span className="faqnumber"> {id} </span>{" "}
            <span style={{ marginLeft: "10px" }}>{question} </span>
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
      {isActive && (
        <div className="answer">
          <h3> {answer} </h3>
        </div>
      )}
    </div>
  );
};

export default Accordion;
