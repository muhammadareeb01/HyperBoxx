import React from "react";
import './tos.css'
import tosData from '../../utils/tos_data.json';
import PageHeading from '../PageHeading/PageHeading';

function TOS() {

    return (
        <>
            <div className="tos_main">
                {/* <div className="border"> */}
                    <div className="tos_sub_main">
                        <PageHeading title="TERMS OF SERVICE" />

                        <div className="service_explain_top">
                            <h3 className="tosquestion">
                                Effective Date: October 1st, 2023
                            </h3>
                            <p className="tospara">
                                Welcome to Hyboxes (the "Site"), where users can purchase mystery boxes and receive virtual or physical items won by opening them. Hyboxes offers a variety of services, including but not limited to Site functionality, mystery box purchases, shipping logistics, and email services (collectively the "Services"). By accessing the Site or using our Services, you confirm that you have read, understood, and agreed to be bound by these Terms of Service (the "Terms").
                            </p>
                        </div>

                        <div>
                            {
                                tosData.explanation.map((content, index) => {
                                    return (
                                        <>
                                            <div className="service_explain">
                                                <div>
                                                    <h3 className="tosquestion"> <span className='tosnumber'> {content.id}  </span>

                                                        <span style={{ marginLeft: "10px" }}> {content.title} </span></h3>
                                                </div>
                                                <div>
                                                    <p className="tospara">{content.content}</p>
                                                    {content.id === 9 && (
                                                        <>
                                                            <ul>
                                                                <li>{content.content_li}</li>
                                                                <li>{content.content_li2}</li>
                                                                <li>{content.content_li3}</li>
                                                                <li>{content.content_li4}</li>
                                                                <li>{content.content_li5}</li>
                                                                <li>{content.content_li6}</li>
                                                                <li>{content.content_li7}</li>

                                                            </ul>
                                                            <p className="tospara">  {content.content_last_para}</p>
                                                        </>
                                                    )}
                                                </div>

                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                {/* </div> */}
            </div>
        </>
    )
}

export default TOS