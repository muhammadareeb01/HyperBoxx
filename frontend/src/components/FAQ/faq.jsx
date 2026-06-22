


import React, { useState } from "react";
import FaqHeader from "./faqheader";
import Accordion from './accordation';
import contactpic from '../../assestes/faq/customer support.png'
import './faq.css'
// import Footer from "../Footer/footer";

function FAQ() {
  const [accordionData, SetaccordionData] = useState([
    {
      id: 1,
      question: "What is Hyboxes?",
      answer: "Hyboxes are exciting virtual boxes filled with mystery products that cater to the interests of sneakerheads, hypebeasts, and fashion enthusiasts. When you purchase a Hybox, you are essentially purchasing a thrilling experience where the contents of the box remain unknown until it is opened. Each Hybox has a specific theme, such as Nike, Supreme, or other popular brands, and is curated to include a range of products related to that theme. The beauty of Hyboxes lies in the element of surprise and the potential to discover high-value items at a fraction of their retail cost. While every box is unique and the contents may vary, you can expect to find a mix of exclusive sneakers, limited-edition apparel, trendy accessories, and other desirable items associated with the chosen theme. When you open a Hybox and win a product you love, it's yours to keep. We even take care of the shipping costs, ensuring that your prize is conveniently delivered straight to your doorstep at no extra charge.",
      border: "79 193 227",
    },
    {
      id: 2,
      question: "Can I choose my own sizes?",
      answer: "Yes, absolutely! We understand the importance of getting the right size for your products, and we strive to provide a personalized experience. When you request an order for a product on our website, you have the option to leave a note during the checkout process. In the note section, you can specify the exact size you desire for products that may have size variations, such as sneakers, apparel, or accessories. Simply let us know your preferred size, and our team will do their best to accommodate your request and include the appropriate size for your product.",
      border: "243 71 210",
    },
    {
      id: 3,
      question: "Do I need to pay for the item I unbox?",
      answer: "No, you do not need to pay for the item you unbox. At Hyboxes, we want to provide you with a hassle-free experience, so once you open a box and discover an item inside, you have the freedom to choose what you want to do with it. If the item is not exactly what you were hoping for or if you prefer something else, you can easily exchange it for credits, which can be used towards future purchases on our website. If you absolutely love the item you unbox and can't wait to make it your own, we offer the option to have it shipped directly to your home at no additional cost. We take care of the shipping fees, ensuring that your chosen item is conveniently delivered to you without any extra charges. The decision is entirely yours–",
      border: "157 90 210",
    },
    {
      id: 4,
      question: "Can i view the contents of the boxes?",
      answer: "Yes, absolutely! We provide you with the opportunity to view the contents of the boxes before opening them. Once you select a box from our website, you can scroll down and explore the products that are included in that particular box. Each product is displayed with a corresponding percentage, which represents the odds of winning that specific item. This way, you can get a preview of the exciting prizes that are up for grabs and make an informed decision about which box to choose based on your preferences and the odds of winning the items you desire.",
      border: "252 216 52"
    },
    {
      id: 5,
      question: "Is Hyboxes legit?",
      answer: "Yes, Hyboxes is indeed legit. We prioritise transparency and fairness in our operations. Hyboxes utilises a provably fair system, meaning that the game odds are predetermined in a verifiable manner. Unlike many online platforms where the mechanics are hidden, we have implemented a cryptographically verifiable system for generating all unboxings.",
      border: "79 193 227"
    },
    {
      id: 6,
      question: "What is the shipping process on Hyboxes? ",
      answer: "We currently ship worldwide 🌎 Once your product is shipped, you'll receive a tracking number via email to keep you updated on its progress within our courier's network. Simply check your email regularly for shipping notifications. We take pride in ensuring a seamless unboxing-to-delivery process for your convenience.",
      border: "26 190 102"
    },
    {
      id: 7,
      question: "What is your refund/return policy? ",
      answer: "At Hyboxes, we value your satisfaction with the prizes you receive. If you happen to receive a damaged item due to delivery, we have a straightforward refund/return policy in place. Simply notify us within one day of receiving the damaged prize, and we will promptly address the issue for you. You have the option to choose either a full refund or a replacement after returning the damaged item. We strive to make the process as hassle-free as possible to ensure your experience with Hyboxes is enjoyable and worry-free.",
      border: "243 71 71"
    },
    {
      id: 8,
      question: " Is everything authentic?",
      answer: "Yes, everything we offer at Hyboxes is authentic. We pride ourselves on providing our customers with genuine products. To ensure authenticity, we source our inventory from trusted and reputable suppliers, primarily StockX. These sources are known for their commitment to verifying the authenticity of the products they offer. We understand the importance of delivering a genuine and satisfying experience to our customers, and we take the necessary steps to ensure that all items in our mystery boxes are authentic and of the highest quality.",
      border: "157 90 102"
    }

  ])

  return (

    <div className="faq_main">
      <div>
        <FaqHeader />
      </div>
      <div className="accordion" >
        {accordionData.map(({ question, answer, border, id }) => (
          <Accordion question={question} answer={answer} border={border} id={id} />
        ))}
      </div>
      <div className="modern-divider"></div>
      <div className="contact_faq">
        <div className="contact_div1">
          <img src={contactpic} className="contactlogo" alt="Customer Support" />
        </div>
        <div className="contact_div2">
          <h2 className="contact_heading">Need Help?</h2>
          <p className="contact_para">
            Have any questions or need assistance? We are here to help you 24/7.
          </p>
          <button className="learn-more button">
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">support@hyboxes.com</span>
          </button>
        </div>
      </div>

    </div>

  );
};

export default FAQ;