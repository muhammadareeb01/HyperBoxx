import { useEffect } from 'react';
import './referral.css'
import 'aos/dist/aos.css';
import AOS from 'aos';
import giftfriend from '../../assestes/referral/giftfriend.png'
import announcment from '../../assestes/referral/announcement.png'
// import announce from '../../assestes/referral/announce.png'
import { FaWallet } from 'react-icons/fa';
import profit from '../../assestes/referral/profit.png'
import { BiCopy } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa';
import { colors } from '@mui/material';
function Referral() {
    useEffect(() => {
        AOS.init({
            delay: 700,
            duration: 800 // Set your desired duration
        });
    }, []);

    return (
        <>
            <div className="referral_main">
                <div className="referral-heading-container">
                    <div className="thin-line-left" data-aos="fade-right" data-aos-delay="300"></div>
                    <h2 className="referral-heading">Referrals</h2>
                    <div className="thin-line-right" data-aos="fade-left" data-aos-delay="300" ></div>
                </div>
                <div className="referral_box">

                    <div className="referral_div1">
                        <div className="ref_left_div">
                            <div className="ref_gift_div">
                                <img src={giftfriend} className='giftbox' width={100 + '%'} alt="" />
                            </div>
                            <div className="ref_text_div">
                                <h3>Gift Your Friend </h3>
                                <p>Gift your friend a free mystery box by sharing your referral -code or link</p>
                            </div>

                        </div>
                        <div className="ref_right_div ref_right_div_gift">

                            <div className="ref_gift_div">
                                <img src={profit} className='profit' width={100 + '%'} alt="" />
                            </div>
                            <div className="ref_text_div">
                                <h3>Gift Your Friend </h3>
                                <p>Get Paid 10% commission  on all deposit your referral make !</p>

                            </div>

                        </div>
                    </div>

                    <div className="referral_div2">
                        <div className="ref_left_div">
                            <div className="ref_gift_div">

                                <img src={announcment} className='announce' width={100 + '%'} alt="" />
                            </div>
                            <div className="ref_input_div">
                                <p>Create a code and gift free box</p>

                                <div class="ref_code_input">
                                    <input placeholder="Create Code" type="text" class="code_input" />
                                    <span>Set Code </span>
                                </div>
                            </div>

                        </div>
                        <div className="ref_left_div ref_left_div_2">

                            <div className="ref_link_div" >
                                <div class="copy_link">
                                    <p>Copy and Share your link</p>

                                    <input type="text" class="copy_link_input" placeholder="Type your text" />
                                    <button class="copy_button">
                                        <BiCopy />

                                    </button>
                                </div>


                            </div>

                        </div>
                    </div>

                    <div className="referral_div3">
                        <div className="ref_left_div_inputs  " data-aos="fade-right">

                            <div className="ref_gift_div ">

                                <FaUser className='user' />

                            </div>
                            <div className="ref_text_div_inputs">
                                {/*  */}
                                <div className="form-control">
                                    <input type="number" className='input-refree' required />
                                    <label>
                                        <span style={{ transitionDelay: '0ms' }}>T</span>
                                        <span style={{ transitionDelay: '50ms' }}>O</span>
                                        <span style={{ transitionDelay: '100ms' }}>T</span>
                                        <span style={{ transitionDelay: '150ms' }}>A</span>
                                        <span style={{ transitionDelay: '200ms' }}>L</span>
                                        <span style={{ transitionDelay: '250ms' }}> </span>
                                        <span style={{ transitionDelay: '300ms' }}>R</span>
                                        <span style={{ transitionDelay: '350ms' }}>E</span>
                                        <span style={{ transitionDelay: '400ms' }}>F</span>
                                        <span style={{ transitionDelay: '450ms' }}>E</span>
                                        <span style={{ transitionDelay: '500ms' }}>R</span>
                                        <span style={{ transitionDelay: '550ms' }}>R</span>
                                        <span style={{ transitionDelay: '600ms' }}>A</span>
                                        <span style={{ transitionDelay: '650ms' }}>L</span>
                                    </label>
                                </div>
                                {/*  */}
                            </div>

                        </div>
                        <div className="ref_right_div" data-aos="fade-up">

                            <div className="ref_gift_div">
                                <FaWallet className='wallet' />

                            </div>
                            <div className="ref_text_div_inputs">
                                {/*  */}
                                <div className="form-control">
                                    <input type="number" className='input-refree' required />
                                    <label>
                                        <span style={{ transitionDelay: '0ms' }}>T</span>
                                        <span style={{ transitionDelay: '50ms' }}>O</span>
                                        <span style={{ transitionDelay: '100ms' }}>T</span>
                                        <span style={{ transitionDelay: '150ms' }}>A</span>
                                        <span style={{ transitionDelay: '200ms' }}>L</span>
                                        <span style={{ transitionDelay: '250ms' }}> </span>
                                        <span style={{ transitionDelay: '300ms' }}>D</span>
                                        <span style={{ transitionDelay: '350ms' }}>E</span>
                                        <span style={{ transitionDelay: '400ms' }}>P</span>
                                        <span style={{ transitionDelay: '450ms' }}>O</span>
                                        <span style={{ transitionDelay: '500ms' }}>S</span>
                                        <span style={{ transitionDelay: '550ms' }}>I</span>
                                        <span style={{ transitionDelay: '600ms' }}>T</span>
                                    </label>
                                </div>
                                {/*  */}
                            </div>


                        </div>

                        <div className="ref_left_div_inputs" data-aos="fade-right">

                            <div className="ref_gift_div">
                                <FaCoins className='coin' />

                            </div>
                            <div className="ref_text_div_inputs">
                                {/*  */}
                                <div className="form-control">
                                    <input type="number" className='input-refree' required />
                                    <label>
                                        <span style={{ transitionDelay: '0ms' }}>T</span>
                                        <span style={{ transitionDelay: '50ms' }}>O</span>
                                        <span style={{ transitionDelay: '100ms' }}>T</span>
                                        <span style={{ transitionDelay: '150ms' }}>A</span>
                                        <span style={{ transitionDelay: '200ms' }}>L</span>
                                        <span style={{ transitionDelay: '250ms' }}> </span>
                                        <span style={{ transitionDelay: '300ms' }}>E</span>
                                        <span style={{ transitionDelay: '350ms' }}>A</span>
                                        <span style={{ transitionDelay: '400ms' }}>R</span>
                                        <span style={{ transitionDelay: '450ms' }}>N</span>
                                        <span style={{ transitionDelay: '500ms' }}>I</span>
                                        <span style={{ transitionDelay: '550ms' }}>N</span>
                                        <span style={{ transitionDelay: '600ms' }}>G</span>

                                    </label>
                                </div>
                                {/*  */}
                            </div>

                        </div>
                        <div className="ref_right_div" data-aos="zoom-in">

                            <div className="ref_gift_div">
                                <FaCoins className='coiny' />
                            </div>
                            <div className="ref_text_div_inputs ref_div_flex">

                                <div className="form-control">
                                    <input type="number" className='input-refree' required />
                                    <label >
                                        <span style={{ transitionDelay: '0ms' }}>A</span>
                                        <span style={{ transitionDelay: '50ms' }}>V</span>
                                        <span style={{ transitionDelay: '100ms' }}>A</span>
                                        <span style={{ transitionDelay: '150ms' }}>I</span>
                                        <span style={{ transitionDelay: '200ms' }}>L</span>
                                        <span style={{ transitionDelay: '250ms' }}>A</span>
                                        <span style={{ transitionDelay: '300ms' }}>B</span>
                                        <span style={{ transitionDelay: '350ms' }}>L</span>
                                        <span style={{ transitionDelay: '400ms' }}>E</span>
                                        <span style={{ transitionDelay: '450ms' }}> </span>
                                        <span style={{ transitionDelay: '500ms' }}>E</span>
                                        <span style={{ transitionDelay: '550ms' }}>A</span>
                                        <span style={{ transitionDelay: '600ms' }}>R</span>
                                        <span style={{ transitionDelay: '650ms' }}>N</span>
                                        <span style={{ transitionDelay: '700ms' }}>I</span>
                                        <span style={{ transitionDelay: '750ms' }}>N</span>
                                        <span style={{ transitionDelay: '800ms' }}>G</span>
                                    </label>

                                </div>
                                {/*  */}
                                {/* </div> */}
                                <div className='claimining-div'>
                                    <span >
                                        <button className='earning_button'>
                                            <span>  C L A I M  </span> <span style={{ padding: "0px 5px" }}> E A R N I N G </span>
                                            <div id="clip">
                                                <div id="leftTop" class="corner"></div>
                                                <div id="rightBottom" class="corner"></div>
                                                <div id="rightTop" class="corner"></div>
                                                <div id="leftBottom" class="corner"></div>
                                            </div>
                                            <span id="rightArrow" class="arrow"></span>
                                            <span id="leftArrow" class="arrow"></span>
                                        </button>
                                    </span>
                                </div>

                            </div>
                            {/* <span className='btn_earning'>  <button >Claim Earning </button></span> */}


                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Referral