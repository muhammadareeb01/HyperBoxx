import React, { useEffect, useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; 
import api from '../../utils/api'; // Your Axios helper

import AOS from 'aos';
import 'aos/dist/aos.css';

function Signup() {
    const navigate = useNavigate();

    // Input States
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPass, setRepeatPass] = useState('');
    
    // UI States
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize Animation
    useEffect(() => {
        AOS.init({ duration: 1200 });
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        // 1. Frontend Validation
        if (password !== repeatPass) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            // 2. Create User in Firebase Auth FIRST
            // We need this to get the unique 'uid'
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 3. Call Your Backend API
            // We pass the 'uid' so the backend can link the database document to this login
            await api.post('/users/register', {
                uid: user.uid, // <--- IMPORTANT: Sending the Firebase ID
                username: username,
                email: email,
                password: password // Sending password so your backend can hash it as requested
            });

            console.log("User Registered & Seeds Generated!");
            
            // 4. Redirect
            navigate('/profile');

        } catch (err) {
            console.error(err);
            // Handle Firebase Errors
            if(err.code === 'auth/email-already-in-use') {
                setError("Email is already registered.");
            } else if (err.response && err.response.data.error) {
                // Handle Backend Errors
                setError(err.response.data.error);
            } else {
                setError("Failed to create account. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="signup_main">
                <div className="container_signup">
                    
                    {/* LEFT SIDE: FORM */}
                    <div className="left" data-aos="fade-right">
                        <form className="form" onSubmit={handleSignup}>
                            
                            <h2 className="mb-4 text-center">Sign Up</h2>
                            {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}

                            <div className="input-block">
                                <input 
                                    className="input" type="text" id="username" required placeholder=" "
                                    value={username} onChange={e => setUsername(e.target.value)}
                                />
                                <label htmlFor="username">Username</label>
                            </div>
                            <div className="input-block">
                                <input 
                                    className="input" type="email" id="email" required placeholder=" "
                                    value={email} onChange={e => setEmail(e.target.value)}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-block">
                                <input 
                                    className="input" type="password" id="pass" required placeholder=" "
                                    value={password} onChange={e => setPassword(e.target.value)}
                                />
                                <label htmlFor="pass">Password</label>
                            </div>
                            <div className="input-block">
                                <input 
                                    className="input" type="password" id="r_pass" required placeholder=" "
                                    value={repeatPass} onChange={e => setRepeatPass(e.target.value)}
                                />
                                <label htmlFor="r_pass">Repeat Password</label>
                            </div>

                            <div className="input-block " style={{ margin: "1%" }}>
                                <span className='terms_of_service'>Terms Of Services</span>
                            </div>

                            <div className="input-block">
                                <span className="acc_already">
                                    <Link to="/login">Have an account? Login</Link>
                                </span>
                                <button className='loginbtn' disabled={loading}>
                                    {loading ? 'Creating...' : 'Sign Up'}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* RIGHT SIDE: IMAGE */}
                    <div className="right" data-aos="fade-left">
                        <div className="img"> 
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 731.67004 550.61784"
                            >
                                <path d="M0,334.13393c0,.66003,.53003,1.19,1.19006,1.19H730.48004c.65997,0,1.19-.52997,1.19-1.19,0-.65997-.53003-1.19-1.19-1.19H1.19006c-.66003,0-1.19006,.53003-1.19006,1.19Z" fill="#3f3d56"></path>
                                <polygon points="466.98463 81.60598 470.81118 130.55703 526.26809 107.39339 494.98463 57.60598 466.98463 81.60598" fill="#a0616a"></polygon>
                                <path d="M464.98463,112.60598l51-21,96,148s-67,15-90,18c-23,3-49-9-49-9l-8-136Z" fill="#6c63ff"></path>
                                <path d="M527.48463,97.10598s56-3,68,27c12,30,22,128,22,128l-122,66.37402-21-32.37402,82-64-29-125Z" fill="#3f3d56"></path>
                                {/* ... Add the rest of your SVG paths here ... */}
                            </svg>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Signup;