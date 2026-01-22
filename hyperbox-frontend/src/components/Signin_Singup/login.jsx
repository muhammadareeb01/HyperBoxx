import React, { useState, useEffect } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from '../../firebaseConfig'; 
import AOS from 'aos'; // <--- Import AOS
import 'aos/dist/aos.css';

function Login() {
  const navigate = useNavigate();
  const db = getFirestore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1200 }); 
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch User Role from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // 3. Conditional Redirect
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile'); // Redirect users to profile
        }
      } else {
        // Fallback if no profile exists
        navigate('/profile');
      }

    } catch (err) {
      console.error(err);
      setError("Invalid Email or Password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="signup_main">
        {/* FIX: Changed class from 'container_login' to 'container_signup' to inherit styles */}
        <div className="container_signup"> 
          
          {/* Note: In your Signup code, 'left' (form) comes before 'right' (image).
              Here 'right' comes first. If layout looks flipped, swap these two divs. */}
          
          <div className="right" data-aos="fade-left">
            <div className="img"> 
              {/* SVG Code remains exactly same as before... */}
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 731.67004 550.61784">
                 <path d="M0,334.13393c0,.66003,.53003,1.19,1.19006,1.19H730.48004c.65997,0,1.19-.52997,1.19-1.19,0-.65997-.53003-1.19-1.19-1.19H1.19006c-.66003,0-1.19006,.53003-1.19006,1.19Z" fill="#3f3d56"></path>
                 <polygon points="466.98463 81.60598 470.81118 130.55703 526.26809 107.39339 494.98463 57.60598 466.98463 81.60598" fill="#a0616a"></polygon>
                 {/* ... rest of your SVG paths ... */}
                 <path d="M527.48463,97.10598s56-3,68,27c12,30,22,128,22,128l-122,66.37402-21-32.37402,82-64-29-125Z" fill="#3f3d56"></path>
              </svg>
            </div>
          </div>
          
          <div className="left" data-aos="fade-right">
            <form className="form" onSubmit={handleLogin}>
              
              {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

              <div className="input-block">
                <input 
                  className="input" 
                  type="email" 
                  id="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Email</label>
              </div>
              
              <div className="input-block">
                <input 
                  className="input" 
                  type="password" 
                  id="pass" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="pass">Password</label>
              </div>

              <div className="input-block">
                <span className="acc_already">
                  <Link to="/signup">Create a New Account</Link>
                </span>
                <button className='loginbtn' disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;