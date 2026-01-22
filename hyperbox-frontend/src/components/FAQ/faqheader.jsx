import React from "react";
import './faq.css'
function FaqHeader() {
    return (
        <>
            <div className="faq_head_div">
                <h1 className="faqhead">
                    FREQUENTLY ASKED QUESTIONS
                </h1>

            </div>
            <div>
                <p className="faqpara">
                    If you have any questions to which you didn’t find the answer for, ask our helpful community on Discord or send us a support ticket.
                </p>
            </div>
        </>
    )
}
export default FaqHeader