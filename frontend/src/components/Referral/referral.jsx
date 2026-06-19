// import { useEffect } from 'react';
// import './referral.css'
// import 'aos/dist/aos.css';
// import AOS from 'aos';
// import giftfriend from '../../assestes/referral/giftfriend.png'
// import announcment from '../../assestes/referral/announcement.png'
// // import announce from '../../assestes/referral/announce.png'
// import { FaWallet } from 'react-icons/fa';
// import profit from '../../assestes/referral/profit.png'
// import { BiCopy } from 'react-icons/bi';
// import { FaUser } from 'react-icons/fa';
// import { FaCoins } from 'react-icons/fa';
// import { colors } from '@mui/material';
// function Referral() {
//     useEffect(() => {
//         AOS.init({
//             delay: 700,
//             duration: 800 // Set your desired duration
//         });
//     }, []);

//     return (
//         <>
//             <div className="referral_main">
//                 <div className="referral-heading-container">
//                     <div className="thin-line-left" data-aos="fade-right" data-aos-delay="300"></div>
//                     <h2 className="referral-heading">Referrals</h2>
//                     <div className="thin-line-right" data-aos="fade-left" data-aos-delay="300" ></div>
//                 </div>
//                 <div className="referral_box">

//                     <div className="referral_div1">
//                         <div className="ref_left_div">
//                             <div className="ref_gift_div">
//                                 <img src={giftfriend} className='giftbox' width={100 + '%'} alt="" />
//                             </div>
//                             <div className="ref_text_div">
//                                 <h3>Gift Your Friend </h3>
//                                 <p>Gift your friend a free mystery box by sharing your referral -code or link</p>
//                             </div>

//                         </div>
//                         <div className="ref_right_div ref_right_div_gift">

//                             <div className="ref_gift_div">
//                                 <img src={profit} className='profit' width={100 + '%'} alt="" />
//                             </div>
//                             <div className="ref_text_div">
//                                 <h3>Gift Your Friend </h3>
//                                 <p>Get Paid 10% commission  on all deposit your referral make !</p>

//                             </div>

//                         </div>
//                     </div>

//                     <div className="referral_div2">
//                         <div className="ref_left_div">
//                             <div className="ref_gift_div">

//                                 <img src={announcment} className='announce' width={100 + '%'} alt="" />
//                             </div>
//                             <div className="ref_input_div">
//                                 <p>Create a code and gift free box</p>

//                                 <div class="ref_code_input">
//                                     <input placeholder="Create Code" type="text" class="code_input" />
//                                     <span>Set Code </span>
//                                 </div>
//                             </div>

//                         </div>
//                         <div className="ref_left_div ref_left_div_2">

//                             <div className="ref_link_div" >
//                                 <div class="copy_link">
//                                     <p>Copy and Share your link</p>

//                                     <input type="text" class="copy_link_input" placeholder="Type your text" />
//                                     <button class="copy_button">
//                                         <BiCopy />

//                                     </button>
//                                 </div>


//                             </div>

//                         </div>
//                     </div>

//                     <div className="referral_div3">
//                         <div className="ref_left_div_inputs  " data-aos="fade-right">

//                             <div className="ref_gift_div ">

//                                 <FaUser className='user' />

//                             </div>
//                             <div className="ref_text_div_inputs">
//                                 {/*  */}
//                                 <div className="form-control">
//                                     <input type="number" className='input-refree' required />
//                                     <label>
//                                         <span style={{ transitionDelay: '0ms' }}>T</span>
//                                         <span style={{ transitionDelay: '50ms' }}>O</span>
//                                         <span style={{ transitionDelay: '100ms' }}>T</span>
//                                         <span style={{ transitionDelay: '150ms' }}>A</span>
//                                         <span style={{ transitionDelay: '200ms' }}>L</span>
//                                         <span style={{ transitionDelay: '250ms' }}> </span>
//                                         <span style={{ transitionDelay: '300ms' }}>R</span>
//                                         <span style={{ transitionDelay: '350ms' }}>E</span>
//                                         <span style={{ transitionDelay: '400ms' }}>F</span>
//                                         <span style={{ transitionDelay: '450ms' }}>E</span>
//                                         <span style={{ transitionDelay: '500ms' }}>R</span>
//                                         <span style={{ transitionDelay: '550ms' }}>R</span>
//                                         <span style={{ transitionDelay: '600ms' }}>A</span>
//                                         <span style={{ transitionDelay: '650ms' }}>L</span>
//                                     </label>
//                                 </div>
//                                 {/*  */}
//                             </div>

//                         </div>
//                         <div className="ref_right_div" data-aos="fade-up">

//                             <div className="ref_gift_div">
//                                 <FaWallet className='wallet' />

//                             </div>
//                             <div className="ref_text_div_inputs">
//                                 {/*  */}
//                                 <div className="form-control">
//                                     <input type="number" className='input-refree' required />
//                                     <label>
//                                         <span style={{ transitionDelay: '0ms' }}>T</span>
//                                         <span style={{ transitionDelay: '50ms' }}>O</span>
//                                         <span style={{ transitionDelay: '100ms' }}>T</span>
//                                         <span style={{ transitionDelay: '150ms' }}>A</span>
//                                         <span style={{ transitionDelay: '200ms' }}>L</span>
//                                         <span style={{ transitionDelay: '250ms' }}> </span>
//                                         <span style={{ transitionDelay: '300ms' }}>D</span>
//                                         <span style={{ transitionDelay: '350ms' }}>E</span>
//                                         <span style={{ transitionDelay: '400ms' }}>P</span>
//                                         <span style={{ transitionDelay: '450ms' }}>O</span>
//                                         <span style={{ transitionDelay: '500ms' }}>S</span>
//                                         <span style={{ transitionDelay: '550ms' }}>I</span>
//                                         <span style={{ transitionDelay: '600ms' }}>T</span>
//                                     </label>
//                                 </div>
//                                 {/*  */}
//                             </div>


//                         </div>

//                         <div className="ref_left_div_inputs" data-aos="fade-right">

//                             <div className="ref_gift_div">
//                                 <FaCoins className='coin' />

//                             </div>
//                             <div className="ref_text_div_inputs">
//                                 {/*  */}
//                                 <div className="form-control">
//                                     <input type="number" className='input-refree' required />
//                                     <label>
//                                         <span style={{ transitionDelay: '0ms' }}>T</span>
//                                         <span style={{ transitionDelay: '50ms' }}>O</span>
//                                         <span style={{ transitionDelay: '100ms' }}>T</span>
//                                         <span style={{ transitionDelay: '150ms' }}>A</span>
//                                         <span style={{ transitionDelay: '200ms' }}>L</span>
//                                         <span style={{ transitionDelay: '250ms' }}> </span>
//                                         <span style={{ transitionDelay: '300ms' }}>E</span>
//                                         <span style={{ transitionDelay: '350ms' }}>A</span>
//                                         <span style={{ transitionDelay: '400ms' }}>R</span>
//                                         <span style={{ transitionDelay: '450ms' }}>N</span>
//                                         <span style={{ transitionDelay: '500ms' }}>I</span>
//                                         <span style={{ transitionDelay: '550ms' }}>N</span>
//                                         <span style={{ transitionDelay: '600ms' }}>G</span>

//                                     </label>
//                                 </div>
//                                 {/*  */}
//                             </div>

//                         </div>
//                         <div className="ref_right_div" data-aos="zoom-in">

//                             <div className="ref_gift_div">
//                                 <FaCoins className='coiny' />
//                             </div>
//                             <div className="ref_text_div_inputs ref_div_flex">

//                                 <div className="form-control">
//                                     <input type="number" className='input-refree' required />
//                                     <label >
//                                         <span style={{ transitionDelay: '0ms' }}>A</span>
//                                         <span style={{ transitionDelay: '50ms' }}>V</span>
//                                         <span style={{ transitionDelay: '100ms' }}>A</span>
//                                         <span style={{ transitionDelay: '150ms' }}>I</span>
//                                         <span style={{ transitionDelay: '200ms' }}>L</span>
//                                         <span style={{ transitionDelay: '250ms' }}>A</span>
//                                         <span style={{ transitionDelay: '300ms' }}>B</span>
//                                         <span style={{ transitionDelay: '350ms' }}>L</span>
//                                         <span style={{ transitionDelay: '400ms' }}>E</span>
//                                         <span style={{ transitionDelay: '450ms' }}> </span>
//                                         <span style={{ transitionDelay: '500ms' }}>E</span>
//                                         <span style={{ transitionDelay: '550ms' }}>A</span>
//                                         <span style={{ transitionDelay: '600ms' }}>R</span>
//                                         <span style={{ transitionDelay: '650ms' }}>N</span>
//                                         <span style={{ transitionDelay: '700ms' }}>I</span>
//                                         <span style={{ transitionDelay: '750ms' }}>N</span>
//                                         <span style={{ transitionDelay: '800ms' }}>G</span>
//                                     </label>

//                                 </div>
//                                 {/*  */}
//                                 {/* </div> */}
//                                 <div className='claimining-div'>
//                                     <span >
//                                         <button className='earning_button'>
//                                             <span>  C L A I M  </span> <span style={{ padding: "0px 5px" }}> E A R N I N G </span>
//                                             <div id="clip">
//                                                 <div id="leftTop" class="corner"></div>
//                                                 <div id="rightBottom" class="corner"></div>
//                                                 <div id="rightTop" class="corner"></div>
//                                                 <div id="leftBottom" class="corner"></div>
//                                             </div>
//                                             <span id="rightArrow" class="arrow"></span>
//                                             <span id="leftArrow" class="arrow"></span>
//                                         </button>
//                                     </span>
//                                 </div>

//                             </div>
//                             {/* <span className='btn_earning'>  <button >Claim Earning </button></span> */}


//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </>
//     )
// }
// export default Referral

import { useEffect, useState } from 'react';
import './referral.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import giftfriend from '../../assestes/referral/giftfriend.png';
import announcment from '../../assestes/referral/announcement.png';
import { FaWallet, FaUser, FaCoins } from 'react-icons/fa';
import profit from '../../assestes/referral/profit.png';
import { BiCopy } from 'react-icons/bi';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Referral() {
    // --- STATE MANAGEMENT ---
    const [loading, setLoading] = useState(false);
    const [activeCode, setActiveCode] = useState('');
    const [newCodeInput, setNewCodeInput] = useState('');
    const [affiliateBalance, setAffiliateBalance] = useState(0);

    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const showModal = (msg) => {
        setModalMessage(msg);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#2b2b2b',
        border: '1px solid #444',
        boxShadow: 24,
        borderRadius: 3,
        p: 4,
        color: 'white',
        textAlign: 'center'
    };

    const auth = getAuth();

// --- DIAGNOSTIC INITIALIZATION ---
    useEffect(() => {
        AOS.init({ delay: 700, duration: 800 });

        console.log("1. 📡 React component mounted. Setting up Auth listener...");

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("2. ✅ Firebase Auth confirmed user is logged in:", user.uid);
                fetchUserData(user);
            } else {
                console.log("2. ❌ Firebase Auth reports NO user is currently logged in.");
            }
        });

        return () => unsubscribe();
    }, []);

    // --- DIAGNOSTIC FETCH USER DATA ---
    const fetchUserData = async (user) => {
        try {
            console.log("3. 🔄 Generating fresh session token...");
            const token = await user.getIdToken();
            
            console.log("4. 🌐 Sending GET request to http://localhost:5000/api/users/profile...");
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log("5. 🛑 Response HTTP Status:", response.status);
            const data = await response.json();
            
            console.log("6. 📦 Data received from backend payload:", data);

            if (data.success && data.user) {
                console.log("7. 💾 Updating React states with profile data...");
                setActiveCode(data.user.affiliateCode || '');
                setAffiliateBalance(Number(data.user.affiliateBalance) || 0);
            } else {
                console.log("7. ⚠️ Backend responded, but success is false or user data is missing.");
            }
        } catch (error) {
            console.error("💥 Network or Parsing Error caught in frontend:", error);
        }
    };

    // --- 2. CREATE CODE ---
    const handleCreateCode = async () => {
        if (activeCode) return showModal("You already have an active code!");
        if (!newCodeInput || newCodeInput.length < 3) return showModal("Code must be at least 3 characters.");

        setLoading(true);
        const user = auth.currentUser;
        
        try {
            const token = await user.getIdToken();
            const response = await fetch('http://localhost:5000/api/affiliate/create-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code: newCodeInput })
            });

            const data = await response.json();

            if (response.ok) {
                setActiveCode(data.code);
                setNewCodeInput('');
                showModal("Affiliate code created successfully!");
            } else {
                showModal(data.error || "Failed to create code.");
            }
        } catch (error) {
            showModal("Server error.");
        } finally {
            setLoading(false);
        }
    };

    // --- 3. CLAIM BALANCE ---
    const handleClaimBalance = async () => {
        if (affiliateBalance <= 0) return showModal("No available balance to claim.");

        setLoading(true);
        const user = auth.currentUser;

        try {
            const token = await user.getIdToken();
            const response = await fetch('http://localhost:5000/api/affiliate/claim-balance', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok) {
                setAffiliateBalance(0);
                showModal("Earnings claimed to your main balance successfully!");
            } else {
                showModal(data.error || "Failed to claim balance.");
            }
        } catch (error) {
            showModal("Server error.");
        } finally {
            setLoading(false);
        }
    };

    // --- 4. COPY LINK ---
    const handleCopyLink = () => {
        if (!activeCode) return showModal("Create a code first!");
        // Change localhost:3000 to your actual frontend domain when live
        const link = `http://localhost:3000/signup?ref=${activeCode}`;
        navigator.clipboard.writeText(link);
        showModal("Link copied to clipboard!");
    };

    return (
        <>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
            >
                <Fade in={openModal}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                            {modalMessage}
                        </Typography>
                        <Button variant="contained" onClick={handleCloseModal} sx={{ bgcolor: '#eab308', color: 'black', '&:hover': { bgcolor: '#ca8a04' } }}>
                            Close
                        </Button>
                    </Box>
                </Fade>
            </Modal>
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
                                <p>Get Paid 5% commission on all deposit your referral make !</p>
                            </div>
                        </div>
                    </div>

                    <div className="referral_div2" style={{ alignItems: 'center' }}>
                        <div className="ref_left_div">
                            <div className="ref_gift_div">
                                <img src={announcment} className='announce' width={100 + '%'} alt="" />
                            </div>
                            <div className="ref_input_div">
                                <p style={{ paddingBottom: '10px', fontSize: '13px', fontFamily: 'PoppinsLight' }}>Create a code and gift free box</p>

                                <div className="ref_code_input">
                                    {/* LINKED: Code Input */}
                                    <input 
                                        placeholder="Create Code" 
                                        type="text" 
                                        className="code_input" 
                                        value={activeCode ? activeCode : newCodeInput}
                                        onChange={(e) => !activeCode && setNewCodeInput(e.target.value.toUpperCase())}
                                        readOnly={!!activeCode}
                                    />
                                    {/* LINKED: Set Code Button */}
                                    <span 
                                        onClick={handleCreateCode} 
                                        style={{ cursor: activeCode ? 'not-allowed' : 'pointer' }}
                                    >
                                        {loading ? 'WAIT...' : (activeCode ? 'ACTIVE' : 'Set Code')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="ref_right_div" style={{ justifyContent: 'flex-end', flex: 1 }}>
                            <div className="ref_input_div" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: '20px' }}>
                                <p style={{ paddingBottom: '10px', fontSize: '13px', fontFamily: 'PoppinsLight' }}>Copy and Share your link</p>
                                
                                <div className="ref_code_input" style={{ minWidth: '280px', maxWidth: '350px' }}>
                                    {/* LINKED: Display Auto-Generated Link */}
                                    <input 
                                        type="text" 
                                        className="code_input" 
                                        placeholder="Create a code first" 
                                        value={activeCode ? `http://localhost:3000/signup?ref=${activeCode}` : ""}
                                        readOnly
                                    />
                                    {/* LINKED: Copy Button */}
                                    <span 
                                        onClick={handleCopyLink}
                                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px 20px' }}
                                    >
                                        <BiCopy size={18} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="referral_div3">
                        <div className="ref_left_div_inputs" data-aos="fade-right">
                            <div className="ref_gift_div ">
                                <FaUser className='user' />
                            </div>
                            <div className="ref_text_div_inputs">
                                <div className="form-control">
                                    {/* FIX: Changed to text, removed readOnly, added dummy onChange to keep CSS :valid working */}
                                    <input type="text" className='input-refree' value="0" required onChange={() => {}} />
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
                            </div>
                        </div>

                        <div className="ref_right_div" data-aos="fade-up">
                            <div className="ref_gift_div">
                                <FaWallet className='wallet' />
                            </div>
                            <div className="ref_text_div_inputs">
                                <div className="form-control">
                                    <input type="text" className='input-refree' value="$0.00" required onChange={() => {}} />
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
                            </div>
                        </div>

                        <div className="ref_left_div_inputs" data-aos="fade-right">
                            <div className="ref_gift_div">
                                <FaCoins className='coin' />
                            </div>
                            <div className="ref_text_div_inputs">
                                <div className="form-control">
                                    {/* Displays dynamic backend balance securely */}
                                    <input type="text" className='input-refree' value={`$${affiliateBalance.toFixed(2)}`} required onChange={() => {}} />
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
                            </div>
                        </div>

                        <div className="ref_right_div" data-aos="zoom-in">
                            <div className="ref_gift_div">
                                <FaCoins className='coiny' />
                            </div>
                            <div className="ref_text_div_inputs ref_div_flex">
                                <div className="form-control">
                                    <input type="text" className='input-refree' value={`$${affiliateBalance.toFixed(2)}`} required onChange={() => {}} />
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
                                <div className='claimining-div'>
                                    <span >
                                        <button 
                                            className='earning_button'
                                            onClick={handleClaimBalance}
                                            disabled={loading || affiliateBalance <= 0}
                                            style={{ opacity: affiliateBalance > 0 ? 1 : 0.5, cursor: affiliateBalance > 0 ? 'pointer' : 'not-allowed' }}
                                        >
                                            <span>  C L A I M  </span> <span style={{ padding: "0px 5px" }}> E A R N I N G </span>
                                            <div id="clip">
                                                <div id="leftTop" className="corner"></div>
                                                <div id="rightBottom" className="corner"></div>
                                                <div id="rightTop" className="corner"></div>
                                                <div id="leftBottom" className="corner"></div>
                                            </div>
                                            <span id="rightArrow" className="arrow"></span>
                                            <span id="leftArrow" className="arrow"></span>
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Referral;