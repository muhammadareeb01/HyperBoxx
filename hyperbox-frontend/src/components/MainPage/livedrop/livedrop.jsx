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
        speed: 3000, // Slower continuous scroll
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear', // Continuous effect
        swipeToSlide: true, 
        pauseOnHover: true, 
        dots: false,
        arrows: false,
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 5 } },
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 480, settings: { slidesToShow: 1.5 } } // Show part of next card
        ],
    };

    // Card Colors Helper
    const getCardColor = (index) => {
        const colors = ['red', 'green', 'blue', 'burgundy', 'yellow'];
        return colors[index % colors.length];
    };

    if (recentBoxes.length === 0) return null;

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
                <Slider {...settings} className="live-drop-cards">
                    {sliderItems.map((box, index) => (
                        <div key={`${box.id}-${index}`} className={`single-card ${getCardColor(index)}`}>
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
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default LiveDrop;