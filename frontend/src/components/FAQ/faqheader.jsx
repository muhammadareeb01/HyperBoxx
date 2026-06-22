import React from "react";
import './faq.css'
import PageHeading from '../PageHeading/PageHeading';

function FaqHeader() {
    return (
        <>
            <div className="faq_head_div">
                <PageHeading title="FREQUENTLY ASKED QUESTIONS" />
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