import React from "react";
import './authentication.css'
// import Footer from "../Footer/footer";
function Authentication() {
    return (
        <>
            <div className="main_authentication parallax container-fluid">

                <div className="head_main">
                    <div className="auth_heading">
                        <h2> AUTENTICATION</h2>
                    </div>

                </div>

                <div className="authpara">
                    <p>
                        At Hyboxes, we have a thorough authentication process to ensure the authenticity of our products. Here's a simplified overview of our two-stage verification and authentication process:
                    </p>
                </div>
                <div className="after_main_auth">

                    <div className="verif_div">
                        <h3>
                            Verification:
                        </h3>

                        <ul>
                            <li>
                                Product accuracy: We verify that the product matches the invoice, ensuring you receive what you ordered.</li>
                            <li>
                                Size and color verification: We check the size and color to ensure they meet your specifications.</li>
                            <li>Condition assessment: We evaluate the product's condition, ensuring it is in deadstock quality without defects.</li>
                        </ul>
                    </div>
                    <div className="authe_div">
                        <h3>
                            Authentication:

                        </h3>

                        <ul>
                            <li>

                                Packaging review: We inspect the packaging to ensure it's undamaged and matches the product..</li>
                            <li>

                                Material examination: We verify that all materials used are genuine and of high quality.</li>
                            <li>Construction evaluation: We check seams, stitching, and other details to ensure they meet authentic standards.
                            </li>
                        </ul>

                    </div>

                    <div className="last_para_auth">
                        <p>
                            Our meticulous authentication process ensures that over 99.8% of customers are satisfied with their products. Every item goes through our rigorous authentication steps to provide you with an authentic experience.


                        </p>
                    </div>
                </div>
                {/* <div>
                    <Footer />
                </div> */}
            </div>

        </>
    )
}

export default Authentication