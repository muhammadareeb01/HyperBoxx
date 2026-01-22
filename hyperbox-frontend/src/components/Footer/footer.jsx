import React from "react"
import './footer.css'
import { Link } from "react-router-dom"
import insta from '../../assestes/footer/instagram.svg'
import twitter from '../../assestes/footer/twitter.svg'
import discord from '../../assestes/footer/discord.svg'
import facebook from '../../assestes/footer/facebook.svg'
// import InstagramIcon from '@mui/icons-material/Instagram';
function Footer() {
    return (
        <>
            <div className="footer">
                <div className="hr"> </div>
                <div className="footer_main">
                    <div>
                        <div class="light-button facebook-light-button">
                            <button class="bt">
                                <div class="light-holder ">
                                    <div class="dot"></div>
                                    <div class="light facebooklight"></div>
                                </div>
                                <div class="button-holder">
                                    <img src={facebook} className="icon" alt="" />
                                    <p>Facebook</p>
                                </div>
                            </button>
                        </div>
                    </div>



                    <div>
                        <div class="light-button insta-light-button">
                            <button class="bt">
                                <div class="light-holder insta">
                                    <div class="dot"></div>
                                    <div class="light instalight"></div>
                                </div>
                                <div class="button-holder">
                                    {/* <InstagramIcon className="icon"/> */}
                                    <img src={insta} className="icon" alt="" />
                                    <p>Instagram</p>
                                </div>
                            </button>
                        </div>


                    </div>
                    <div>
                        <div class="light-button twitter-light-button">
                            <button class="bt">
                                <div class="light-holder ">
                                    <div class="dot"></div>
                                    <div class="light twitterlight"></div>
                                </div>
                                <div class="button-holder">
                                    <img src={twitter} className="icon" alt="" />

                                    <p>Twitter</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="light-button discord-light-button">
                        <button class="bt">
                            <div class="light-holder discord">
                                <div class="dot"></div>
                                <div class="light discordlight"></div>
                            </div>
                            <div class="button-holder">
                                <img src={discord} className="icon" alt="" />

                                <p>Discord</p>
                            </div>
                        </button>
                    </div>

                    <div>


                    </div>
                </div>

                <div className="footer_main2">
                    <div>
                        <Link to='contact' className='linkStyle'>   <p>   CONTACT  </p> </Link></div>
                    <div>
                        <Link to='faq' className='linkStyle'>  <p> FAQ</p> </Link></div>
                    <div>
                        <Link to='termsofservice' className="linkStyle"><p> TERMS OF SERVICES </p> </Link> </div>
                    <div>
                        <Link to='shiipingAndrefund' className="linkStyle">  <p> SHIPPING AND REFUND </p></Link></div>
                    <div>
                        <Link to='privacypolicy' className='linkStyle'>    <p> PRIVACY AND POLICY </p> </Link> </div>
                </div>

                <div className="footer_para">
                    <p className="para1"> By Using our Website. You agree to out Terms of Services</p>
                </div>


                <div className="footer_para ">
                    <p className="para2"> 2020-2023. All right reserved.</p>
                </div>
            </div>
        </>
    )
}
export default Footer 