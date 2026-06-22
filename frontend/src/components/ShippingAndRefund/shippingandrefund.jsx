import React, { useEffect, useRef } from 'react';
import { FaExchangeAlt, FaBox, FaHandHoldingUsd } from 'react-icons/fa';
import './shippingandrefund.css'
import PageHeading from '../PageHeading/PageHeading';

function ShippingAndRefund() {
    const returnItems = [
        {
            icon: <FaHandHoldingUsd />,
            text: "Return for Refund: Eligible merchandise can be returned for a refund. Please note that only the item price paid during checkout will be refunded, and costs of delivery won't be refunded.",
        },
        {
            icon: <FaExchangeAlt />,
            text: "Exchange: Eligible merchandise can be exchanged for a different variation (e.g., different size or color of the same product).",
        },
        {
            icon: <FaBox />,
            text: "Replacement: Eligible merchandise can be returned and replaced with the same exact merchandise in case of damage, defects, or incorrect items.",
        },
        {
            icon: <FaHandHoldingUsd />,
            text: "Fees: Returns resulting from our error won't incur a fee. However, for returns not caused by our error, a fee will apply as defined in our Delivery policy. The maximum refund will not exceed the total amount paid for the case opened deposits.",
        },
        {
            icon: <FaExchangeAlt />,
            text: "Refunds are applied to the original payment method. Please allow up to 10 days after the receipt of returned merchandise to receive the refund.",
        },
        {
            icon: <FaBox />,
            text: "Product Condition: Returned merchandise must be in new or unused original condition and include all factory-packed accessories and paperwork. Incomplete returns will not be accepted. Removal or alteration of a product's UPC number or serial number label will void any possibility of return for credit or replacement. The product serial number must match the serial number in our records.",
        },
        {
            icon: <FaHandHoldingUsd />,
            text: "Exceptions: Some items may not be returned, including gift cards, consumables, intangible goods, and some TVs.",
        },
        {
            icon: <FaExchangeAlt />,
            text: "Return Shipping:  You will be responsible for any return shipping costs. However, if the merchandise is defective, damaged, or the result of our error, we will cover the cost of return shipping in the form of Website Balance.",
        },
        {
            icon: <FaBox />,
            text: "Limitations on Returns: Items are no longer eligible for a return after 30 days of the delivery date. We may refuse investigation of issues initiated after 60 days of the delivery date.",
        },
        {
            icon: <FaHandHoldingUsd />,
            text: "Shipping & Delivery: Before ordering items, familiarize yourself with your local import, customs, and tax laws. We do not deliver to Private Bag or Post Office Box addresses. If your order is accepted, you will receive a confirmation email. We make reasonable efforts to deliver items as quickly as possible, but we are not responsible for delays beyond our control. The risk of damage or loss of items passes to you upon delivery.",
        },
        {
            icon: <FaBox />,
            text: "Shipping Time: Shipping times for clothing articles are usually within 14 days, while electronics are delivered within 5 days on average.",
        },
    ];
    const paraRef = useRef(null);

    useEffect(() => {
        const paraElement = paraRef.current;
        const handleScroll = () => {
            // Check if the content overflows, if so, add the scrollable class
            paraElement.classList.toggle('scrollable', paraElement.scrollHeight > paraElement.clientHeight);
        };

        // Call the handleScroll function on mount and whenever the content changes
        handleScroll();
        window.addEventListener('resize', handleScroll);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener('resize', handleScroll);
        };
    }, []);
    return (
        <>
            <div className="ship_refund_main">
                <div className="ship_refund_sub_main">
                    <PageHeading title="Shipping And Refund" />
                    <div>

                        <p className='ship_refund_para'>
                            Returns and Refunds: Hyboxes allow returns for most merchandise within 30 days of the date delivered according to tracking information. If no tracking number was assigned to the shipment, the policy is within 35 days of the date the item was shipped. To initiate a return, please contact our support team and provide detailed information about the error, such as screenshots of error messages, log files, and a detailed description of your actions.

                        </p>
                    </div>
                    <div className="ship_refund_para2" ref={paraRef}>
                        <p className='ship_refund_para'>
                            Our Return Policy covers the following types of return situations:
                        </p>

                        <ul className="refund-list">
                            {returnItems.map((item, index) => (
                                <li key={index}>
                                    {item.icon && <span className='icon_'>{item.icon}</span>}
                                    <span className='li_text'>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                        <p className='ship_refund_para'>
                            We aim to make your shopping experience with Hyboxes as easy and trustworthy as possible. If you have any questions or concerns, please contact our support team at support@hyboxes.com.
                        </p>
                    </div>
                    {/* <p className='ship_refund_para'>
                    We aim to make your shopping experience with Hyboxes as easy and trustworthy as possible. If you have any questions or concerns, please contact our support team at support@hyboxes.com.
                    </p> */}
                </div>
            </div>
        </>
    )
}

export default ShippingAndRefund