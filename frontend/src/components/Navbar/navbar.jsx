import React, { useState, useEffect } from 'react';
import logo from '../../assestes/navbar/logo.png';
import userImg from '../../assestes/navbar/user.png';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import MysteryBoxx from '../../assestes/navbar/subscription.png';
import freebox from '../../assestes/navbar/mystery-box.png';
import Affilate from '../../assestes/navbar/affiliate.png';
import { Sling as Hamburger } from 'hamburger-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

function Navbar() {
    const [isNavVisible, setNavVisible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [userData, setUserData] = useState(null);
    
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    const toggleNav = () => {
        setNavVisible(!isNavVisible);
    };

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (windowWidth <= 991 && isNavVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isNavVisible, windowWidth]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // 1. Redirect to /login after logout
            navigate('/login'); 
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const unsubSnapshot = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                    if (doc.exists()) {
                        setUserData(doc.data());
                    }
                });
                return () => unsubSnapshot();
            } else {
                setUserData(null);
            }
        });

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            unsubscribeAuth();
        };
    }, []);

    return (
        <div className='nav'>
            <div className={`main ${isNavVisible ? 'nav-expanded' : ''} `}>
                <div className="logo">
                    <Link to='/'> <img src={logo} alt="logo" width={100 + "%"} /> </Link>
                </div>
                
                <div className="content">
                    <div className={`link_btn_div ${isNavVisible ? 'nav-visible' : ''}`} >
                        <div className="row1-main">
                            <div className="row1"> <Link to='support' className='linkStyle'>How It Works </Link></div>
                            {/* Check if you want this authentication link to change too, or keep as is */}
                            <div className="row1"> <Link to='authentication' className='linkStyle'>Authentication </Link></div>
                            <div className="row1"> <Link to='termsofservice' className='linkStyle'> Terms of services </Link></div>
                            <div className="row1"> <Link to='support' className='linkStyle'> Support </Link> </div>
                            
                            {/* Mobile Only Logout - Hidden on Desktop via CSS */}
                            {userData && (
                                <div className="row1 mobile-only-logout" onClick={handleLogout} style={{ cursor: 'pointer' }}> 
                                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}> LOG OUT </span>
                                </div>
                            )}
                         
                        </div>
                        <div className="row2-main">
                            <div className='link_btn_main_div'>
                                <div className='link_div' >
                                    <div className="row2" style={{ display: "flex", justifyContent: "center" }} >
                                        <div style={{ padding: "2px 5px" }}> <img style={{ width: "100%", marginTop: '-18px' }} src={MysteryBoxx} alt="" /></div>
                                        <div> <Link to='/' className='linkStyle'> <span> MYSTERY BOXES </span></Link> </div>
                                    </div>
                                    <div className="row2" style={{ display: "flex", justifyContent: "center" }} >
                                        <div style={{ padding: "2px 5px" }}> <img style={{ width: "100%", marginTop: '-10px' }} src={Affilate} alt="" /></div>
                                        <div> <Link to='referral' className='linkStyle'> <span> AFFILIATES </span> </Link> </div>
                                    </div>
                                    <div className="row2" style={{ display: "flex", justifyContent: "center" }} >
                                        <div style={{ padding: "2px 5px" }}> <img style={{ width: "100%", marginTop: '-15px' }} src={freebox} alt="" /></div>
                                        <div> <Link to='freebox' className='linkStyle'> <span>FREE BOX </span> </Link> </div>
                                    </div>
                                </div>
                                <div className='btn_div'>
                                    <div className='row2_btns'>
                                        <Link to='deposit' className='linkStyle'>
                                            <button className='depositbtn'>
                                                <div className="svg-wrapper-1">
                                                    <div className="svg-wrapper">
                                                        <FontAwesomeIcon icon={faMoneyBill} className='iconmoney' />
                                                    </div>
                                                </div>
                                                <span className='deposit_span'> DEPOSIT</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="user_div" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    
                    {/* Balance moved here */}
                    {userData && (
                        <div className="amountbtn" style={{ margin: 0 }}>
                            <span className='amount_span' style={{ fontSize: '0.9rem', padding: '6px 12px' }}>  
                                <span className='dollar'>$ </span> 
                                {Number(userData.balance).toFixed(2)}  
                            </span>
                        </div>
                    )}

                       
                    {/* 2. Changed Redirect: If no user -> go to /login */}
                    <div>
                        <Link to={userData ? '/profile' : '/login'} className='linkStyle'>
                            <button className="userBtn">
                                <div style={{ display: 'flex' }}>
                                    <div className='IconContainer'>
                                        <img src={userImg} alt="" />
                                    </div>
                                    <div>
                                        <p className="text">
                                            {userData ? userData.username : "LOGIN"}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </Link>
                    </div>

                    {userData && (
                        <div className='logout_btn_div desktop-logout-container'>
                            <button 
                                className="userBtn" // Reuse userBtn class for consistent circular animation
                                onClick={handleLogout}
                                style={{ 
                                    background: 'linear-gradient(135deg, #d32f2f, #f44336)', 
                                    width: '40px', 
                                    height: '40px', 
                                    padding: 0,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                                title="Log Out"
                            >
                                <div className='IconContainer' style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FontAwesomeIcon 
                                        icon={faSignOutAlt} 
                                        className='iconmoney' 
                                        style={{ fontSize: '16px', color: 'white', margin: 0 }} 
                                    />
                                </div>
                            </button>
                        </div>
                    )}

                    {windowWidth <= 800 && (
                        <div className="toggle-button">
                            <Hamburger toggled={isNavVisible} toggle={toggleNav} color="#FFFF" easing="ease-in" rounded size={24} />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Navbar;