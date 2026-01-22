import { useState, useEffect } from "react";
import userImg from "../../assestes/navbar/user.png"; 
import "./profile.css";
import ProfileInventory from "./profileinverntory";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

function MyProfile() {
  const [color, setColor] = useState("#323937");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading as true

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // 1. Wait for Auth to be ready
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // 2. Auth is ready! Now listen to the database in real-time
        const unsubscribeSnapshot = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
          setLoading(false); // Data loaded
        });

        // Cleanup the snapshot listener when component unmounts
        return () => unsubscribeSnapshot();
      } else {
        // User is not logged in
        setUserData(null);
        setLoading(false);
      }
    });

    // Cleanup the auth listener
    return () => unsubscribeAuth();
  }, []);

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const beforeStyle = {
    content: '""',
    background: `linear-gradient(40deg, ${color} 0%, ${color} 60%)`,
  };

  // --- SHOW LOADING SPINNER WHILE FETCHING ---
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: 'white' }}>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="context">
        <div className="main_my_profile">
          <div className="profile_div">
            <div className="profile_card" style={beforeStyle}>
              
              <div className="profile_image">
                <img src={userImg} width={100 + "%"} alt="User" />
              </div>
              
              <div className="profile-card-info">
                {/* SAFE CHECK: Ensure userData exists before accessing properties */}
                <span>{userData?.username || "Mystery User"}</span>
                <p>{userData?.email}</p>
                
                {/* Display Balance */}
                <h3 style={{color: '#2dfc1a', marginTop: '10px'}}>
                    ${userData?.balance ? Number(userData.balance).toFixed(2) : "0.00"}
                </h3>
              </div>

              <div className="btn-add-balance">
                <Link to="/deposit" className="btn-content">
                  <span className="btn-title">ADD Balance</span>
                  <span className="icon-arrow">
                    <svg width="66px" height="43px" viewBox="0 0 66 43">
                      <g id="arrow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path id="arrow-icon-one" fill="#FFFFFF" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"></path>
                      </g>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
            
            <span style={{ textAlign: "center", display: "block", fontWeight: "700", margin: "2% auto", color: color }}>
               Choose your Card Profile Color
            </span>
            <input id="color-input" type="color" value={color} className="color custom-color-input" onChange={handleColorChange} />
          </div>
          
          <div className="history_inventory_div">
            <div className="list_main_div">
              <ul>
                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                  <div><li>Setting</li></div>
                  <div><li>History</li></div>
                </div>
              </ul>
            </div>
            <div>
              {/* Pass the userData to your inventory component so it can use the ID */}
              {userData && <ProfileInventory userId={auth.currentUser?.uid} />}
            </div>
          </div>
        </div>
      </div>

      <div className="area">
        <ul className="circles">
           {/* (Circles CSS kept same) */}
           {[...Array(10)].map((_, i) => <li key={i}></li>)}
        </ul>
      </div>
    </>
  );
}

export default MyProfile;