// import './freebox.css'
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { useEffect, useState } from 'react';
// import freebox from '../../assestes/freebox/freecase.png'
// import freeboxbtn from '../../assestes/freebox/freecase-btn.png'
// import * as React from 'react';
// // import Backdrop from '@mui/material/Backdrop';
// import Box from '@mui/material/Box';
// import Modal from '@mui/material/Modal';
// import Fade from '@mui/material/Fade';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import modalbox from '../../assestes/freebox/modalbox.png'
// // import referalpeople from '../../assestes/freebox/referral-people.png'
// // import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
// function FreeBox() {
//     const [open, setOpen] = useState(false);

//     const handleOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };
//     useEffect(() => {
//         AOS.init({
//             once: true, // Animation will occur only once
//         });
//     }, []);

//     const modalStyle = {
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: 500,
//         height: 500,
//         backgroundImage: `url(${modalbox})`,
//         backgroundSize: 'cover', // This will cover the entire modal with the image
//         backgroundPosition: 'center',
//         border: '2px solid #000',
//         boxShadow: 24,
//         borderRadius: 3,
//         p: 4,
//     };

//     return (
//         <>
//             <div className="free_box_main">

//                 <div className="sub_free_box">
//                     <div className="first_free_box">
//                         <div className="left_box" >
//                             <img src={freebox} alt="freebox" className='freeboximg' />
//                             <h2 className='freebox_head'>
//                                 Welcome Box
//                             </h2>
//                             <p className='freebox_para '>
//                                 Register an account and receive 3 free boxes. Earn more cases by inviting friends...
//                             </p>

//                             <div class="input-container">
//                                 <input type="text" className='input-promo' placeholder="Enter a Promo Code to recieve a Free Box" />
//                                 <button class="promobtn">Promo Code </button>

//                             </div>
//                             <p className='btn_para'>
//                                 <button className='free_btn' onClick={handleOpen}>

//                                     <img src={freeboxbtn} height={36 + 'px'} width={36 + 'px'} alt="" />

//                                     <span class="now">Now!</span>
//                                     <span class="play">Claim</span>
//                                 </button>
//                             </p>

//                             <Modal
//                                 aria-labelledby="transition-modal-title"
//                                 aria-describedby="transition-modal-description"
//                                 open={open}
//                                 onClose={handleClose}
//                                 closeAfterTransition
//                             >
//                                 <Fade in={open}>
//                                     <Box sx={modalStyle}>
//                                         <Typography id="transition-modal-title" variant="h6" component="h2">
//                                             Congrats! You got yourself a Free Box!
//                                         </Typography>

//                                         <Button onClick={handleClose} className='closebtn'>Close</Button>
//                                     </Box>
//                                 </Fade>
//                             </Modal>


//                         </div>
//                         {/* <div className="right_text" data-aos="fade-left" data-aos-duration="1800" >
//                             <h2 className='freebox_head'>
//                                 Welcome Box
//                             </h2>
//                             <p className='freebox_para '>
//                                 Register an account and receive 3 free boxes. Earn more cases by inviting friends...
//                             </p>
//                             <p className='btn_para'>
//                                 <button className='free_btn'>

//                                     <img src={freebox} height={36 + 'px'} width={36 + 'px'} alt="" />

//                                     <span class="now">Box!</span>
//                                     <span class="play">Open</span>
//                                 </button>
//                             </p>
//                         </div> */}
//                     </div>
//                     {/* <div className="border_bottom">
//                     </div> */}

//                     {/* <div className="second_free_box">

//                         <div className="right_text_second left_box_second" data-aos="fade-right" data-aos-duration="1200" >
//                             <h2 className='freebox_head'>
//                                 How it works
//                             </h2>
//                             <p className='freebox_para '>
//                                 <ul>
//                                     <li>
//                                         <span className='icon_'><Inventory2OutlinedIcon /></span>    Get your referral link/code and invite players to sign up.
//                                     </li>
//                                     <li>
//                                         <span className='icon_'><Inventory2OutlinedIcon /></span>   As soon as new user claims your code, both of you will receive a free Welcome Box.
//                                     </li> <li>

//                                         <span className='icon_'><Inventory2OutlinedIcon /></span>   You will receive a percentage of each deposit your referral makes on the website.
//                                     </li>
//                                     <li>

//                                         <span className='icon_'><Inventory2OutlinedIcon /></span>   Track your earnings and cash out whenever you wish.

//                                     </li>
//                                 </ul></p>

//                         </div>
//                         <div className="left_box_second" data-aos="fade-left" data-aos-duration="1200">
//                             <img src={referalpeople} alt="referal" width={50 + "%"} />
//                         </div>
//                     </div> */}

//                 </div>
//             </div>
//         </>
//     )
// }
// export default FreeBox

import './freebox.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import freebox from '../../assestes/freebox/freecase.png'
import nikebox from '../../assestes/mainpagebox/box.png'
import freeboxbtn from '../../assestes/freebox/freecase-btn.png'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import modalbox from '../../assestes/freebox/modalbox.png'
import LockIcon from '@mui/icons-material/Lock';

import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Added Firebase Auth

function FreeBox() {
    // --- UI States ---
    const [open, setOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    
    // --- Data States ---
    const [promoCode, setPromoCode] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const auth = getAuth();

    // --- INITIALIZATION ---
    useEffect(() => {
        AOS.init({ once: true });

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData(user);
            }
        });

        return () => unsubscribe();
    }, []);

    // --- FETCH USER PROFILE ---
    const fetchUserData = async (user) => {
        try {
            const token = await user.getIdToken();
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setUserData(data.user);
            }
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    // --- REDEEM PROMO CODE ---
    const handleRedeemCode = async () => {
        if (!promoCode) {
            setModalMessage("Please enter a code first.");
            setOpen(true);
            return;
        }
        
        setLoading(true);
        const user = auth.currentUser;
        
        try {
            const token = await user.getIdToken();
            const response = await fetch('http://localhost:5000/api/affiliate/redeem-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code: promoCode })
            });

            const data = await response.json();
            if (response.ok) {
                setModalMessage("Promo Code Redeemed! Free boxes unlocked.");
                setOpen(true);
                setPromoCode('');
                fetchUserData(user); // Refresh profile to unlock boxes
            } else {
                setModalMessage(data.error || "Failed to redeem code.");
                setOpen(true);
            }
        } catch (error) {
            setModalMessage("Server error.");
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // --- CLAIM FREE BOX (LEVEL 1) ---
    const handleClaimBox = async () => {
        setLoading(true);
        const user = auth.currentUser;

        try {
            const token = await user.getIdToken();
            const response = await fetch('http://localhost:5000/api/free-boxes/open', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ boxLevel: 1 }) // Hitting Level 1
            });

            const data = await response.json();
            
            if (response.ok) {
                setModalMessage(`Congrats! You won $${(1.00).toFixed(2)}!`);
                setOpen(true);
                fetchUserData(user); // Refresh timer
            } else {
                setModalMessage(data.error || "Failed to open box.");
                setOpen(true);
            }
        } catch (error) {
            setModalMessage("Server error.");
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // --- CALCULATE COOLDOWN / LOCK STATUS ---
    const getButtonStatus = () => {
        if (!userData) return "Loading...";
        if (!userData.referredBy) return "Need Code";
        if ((userData.lifetimeBoxesOpened || 0) < 10) return "Need 10 Boxes";

        const lastClaimTime = userData.lastFreeBoxClaims?.['box_1'];
        if (lastClaimTime) {
            const claimDate = new Date(lastClaimTime._seconds ? lastClaimTime._seconds * 1000 : lastClaimTime);
            const hoursSinceClaim = Math.abs(new Date() - claimDate) / 36e5;
            if (hoursSinceClaim < 24) {
                return `Wait ${(24 - hoursSinceClaim).toFixed(1)}h`;
            }
        }
        return "Claim";
    };

    const handleClose = () => {
        setOpen(false);
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 500,
        backgroundImage: `url(${modalbox})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius: 3,
        p: 4,
    };

    const buttonText = getButtonStatus();
    const isLocked = buttonText !== "Claim";

    return (
        <>
            <div className="free_box_main">
                <div className="sub_free_box">
                    <div className="first_free_box">
                        <div className="left_box" >
                            <h2 className='freebox_head'>
                                Claim free box
                            </h2>

                            <div className="top_instructions">
                                <p>Using a friend's code gives them a 5% commission on all deposits!</p>
                                <p>If you don't have a code, use code "Free".</p>
                            </div>

                            <img src={nikebox} alt="freebox" className='freeboximg' />

                            <div className="input-container">
                                {/* LINKED: Promo Code Input */}
                                <input 
                                    type="text" 
                                    className='input-promo' 
                                    placeholder="Code: Free" 
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    disabled={userData?.referredBy} // Disable if they already used a code
                                />
                                {/* LINKED: Promo Code Button */}
                                <button 
                                    className="promobtn" 
                                    onClick={handleRedeemCode}
                                    disabled={loading || userData?.referredBy}
                                >
                                    {userData?.referredBy ? 'Code Active' : 'ENTER'}
                                </button>
                            </div>
                            
                            <p className='btn_para'>
                                {/* LINKED: Claim Box Button */}
                                <button 
                                    className='free_btn' 
                                    onClick={handleClaimBox}
                                    disabled={loading || isLocked}
                                    style={{ opacity: isLocked ? 0.6 : 1, cursor: isLocked ? 'not-allowed' : 'pointer', margin: 'auto' }}
                                >
                                    <img src={freeboxbtn} height={36 + 'px'} width={36 + 'px'} alt="" />
                                    <span className="now">Now!</span>
                                    {/* Dynamic Text based on Backend Status */}
                                    <span className="play" style={{ fontSize: isLocked ? '14px' : 'inherit' }}>
                                        {buttonText}
                                    </span>
                                </button>
                            </p>

                            <div className="levels_grid">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((level, i) => (
                                    <div className="level_box_container" key={i}>
                                        <img src={nikebox} alt={`Level ${level}`} className="level_box_img" />
                                        <div className="level_box_overlay">
                                            <LockIcon style={{ fontSize: '14px', marginRight: '5px', verticalAlign: 'text-bottom' }} />
                                            COMING SOON
                                        </div>
                                        <div className="level_box_label">Level {level}</div>
                                    </div>
                                ))}
                            </div>

                            <Modal
                                aria-labelledby="transition-modal-title"
                                aria-describedby="transition-modal-description"
                                open={open}
                                onClose={handleClose}
                                closeAfterTransition
                            >
                                <Fade in={open}>
                                    <Box sx={modalStyle}>
                                        {/* LINKED: Dynamic Modal Message */}
                                        <Typography id="transition-modal-title" variant="h6" component="h2" style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
                                            {modalMessage}
                                        </Typography>

                                        <Button onClick={handleClose} className='closebtn' style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                                            Close
                                        </Button>
                                    </Box>
                                </Fade>
                            </Modal>

                        </div>
                        {/* Right side commented out code untouched... */}
                    </div>
                </div>
            </div>
        </>
    )
}
export default FreeBox;