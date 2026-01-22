import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './livedrop.css'; 

// Firestore Imports
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

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

    // --- LOOPING LOGIC ---
    const sliderItems = recentBoxes.length > 0 && recentBoxes.length < 10
        ? [...recentBoxes, ...recentBoxes, ...recentBoxes] 
        : recentBoxes;

    // --- SLIDER SETTINGS ---
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        swipeToSlide: true, 
        pauseOnHover: true, 
        dots: false,
        arrows: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 600, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ],
    };

    // Card Colors Helper
    const getCardColor = (index) => {
        const colors = ['red', 'green', 'blue', 'burgundy'];
        return colors[index % colors.length];
    };

    if (recentBoxes.length === 0) return null;

    return (
        <div className='live-drop-cards-text-div'>
            <div className='text-live'>
                <h2 className='live-head'> 
                    <span style={{ color: "#e8002a" }}> L </span>
                    <span style={{ color: "#d00000" }}> I </span> 
                    <span style={{ color: "#d00000" }}> V </span> 
                    <span style={{ color: "#e9190f" }}> E </span> 
                    <span style={{ color: "#ff0000" }}> DROP </span>
                </h2>
            </div>

            <div className='l-card-div'>
                <Slider {...settings} className="live-drop-cards">
                    {sliderItems.map((box, index) => (
                        <div key={`${box.id}-${index}`} className={`single-card ${getCardColor(index)}`}
                             style={{
                                 display: 'flex',           
                                 flexDirection: 'row',      // <--- HORIZONTAL STACK
                                 alignItems: 'center',      // Center vertically
                                 justifyContent: 'flex-start', // Start from left
                                 overflow: 'hidden',        
                                 padding: '10px 15px',      // Nice spacing
                                 height: '80px'             // Fixed height prevents jumping
                             }}
                        >
                            
                            {/* IMAGE (Icon on Left) */}
                            <img 
                                src={box.image} 
                                className="tip" 
                                alt={box.title} 
                                style={{ 
                                    width: '50px',        // Fixed small width
                                    height: '50px',       // Fixed small height
                                    objectFit: 'cover',   
                                    borderRadius: '8px',  
                                    marginRight: '15px',  // Space between image and text
                                    flexShrink: 0         // Prevent image from squishing
                                }} 
                            />
                            
                            {/* TITLE (Text on Right) */}
                            <p className="second-text" style={{ 
                                margin: 0,
                                fontSize: '15px', 
                                fontWeight: 'bold',
                                textAlign: 'left',      // Left align text
                                whiteSpace: 'nowrap',   
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                color: 'white'          // Force white text just in case
                            }}>
                                {box.title}
                            </p>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default LiveDrop;