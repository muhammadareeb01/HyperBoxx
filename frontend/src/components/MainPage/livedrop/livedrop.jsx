import React, { useState, useEffect } from 'react';
import './livedrop.css'; 
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

import { Link } from 'react-router-dom';

const LiveDrop = () => {
    const [recentBoxes, setRecentBoxes] = useState([]);
    const db = getFirestore();

    // --- FETCH DATA ---
    useEffect(() => {
        const q = query(
            collection(db, "boxes"), 
            orderBy("createdAt", "desc"), 
            limit(20) 
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const boxesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecentBoxes(boxesData);
        });

        return () => unsubscribe();
    }, [db]);

    // Card Colors Helper
    const getCardColor = (index) => {
        const colors = ['red', 'green', 'blue', 'burgundy', 'yellow'];
        return colors[index % colors.length];
    };

    if (recentBoxes.length === 0) return null;

    // --- INFINITE SCROLL LOGIC ---
    // We duplicate the list to create a seamless loop.
    // CSS translates -50% (half width), so we need 2 full sets.
    // If the list is short, we repeat it more times to fill width.
    const minimalItemCount = 20; // Ensure we have enough items to scroll smoothly
    let displayItems = [...recentBoxes];
    
    while (displayItems.length < minimalItemCount) {
        displayItems = [...displayItems, ...recentBoxes];
    }
    // Now double it for the seamless marquee effect
    const marqueeItems = [...displayItems, ...displayItems];


    return (
        <div className='live-drop-cards-text-div'>
            <div className='text-live'>
                <div className='live-head'> 
                    <span className="live-dot"></span>
                    <span style={{ color: "#fff" }}>LIVE</span>
                    <span style={{ color: "#ef4444" }}>DROP</span>
                </div>
            </div>

            <div className='l-card-div'>
                <div className="marquee-wrapper">
                    <div className="marquee-content">
                        {marqueeItems.map((box, index) => (
                            <Link to={`/box/${box.id}`} key={`${box.id}-${index}`} style={{ textDecoration: 'none' }}>
                                <div className={`single-card ${getCardColor(index)}`}>
                                    {/* IMAGE (Icon on Left) */}
                                    <img 
                                        src={box.image} 
                                        className="tip" 
                                        alt={box.title} 
                                    />
                                    
                                    {/* TITLE (Text on Right) */}
                                    <p className="second-text">
                                        {box.title}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveDrop;