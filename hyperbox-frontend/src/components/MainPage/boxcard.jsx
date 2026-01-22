// import React, { useState } from 'react';
// import './boxcard.css'
// import Box from '../../assestes/mainpagebox/box.png';
// import ButtonOpen from './btn'
// const BoxCard = () => {

//     const [boxesname, setBoxesName] = useState([
//         {
//             id: 1,
//             title: 'Jordans Lucky',
//             img: Box,
//             price: '4.99$',
//             color: 'green'

//         },
//         {
//             id: 2,
//             title: 'Jordan Premium',
//             img: Box,

//             price: '24.99$',
//             color: 'blue'
//         },
//         {
//             id: 3,
//             title: 'Jordan Deluxe',
//             img: Box,
//             price: '59.99$',
//             color: 'purple'
//         },
//         {
//             id: 4,
//             title: 'Iphone Lucky',
//             img: Box,

//             price: '2.99$',
//             color: 'green'

//         },
//         {
//             id: 5,
//             title: 'Apple Mystery',
//             img: Box,

//             price: '9.99$',
//             color: 'green'
//         },
//         {
//             id: 6,
//             title: 'Apple Deluxe',
//             img: Box,

//             price: '49.99$',
//             color: 'blue'
//         },
//         {
//             id: 7,
//             title: 'Credit Boost',
//             img: Box,

//             price: '0.49$',
//             color: 'grey'
//         },
//         {
//             id: 8,
//             title: 'Apple Budget',
//             img: Box,

//             price: '0.99$',
//             color: 'grey'
//         },
//         {
//             id: 9,
//             title: 'Nike Budget',
//             img: Box,
//             price: '0.99$',
//             color: 'grey'
//         },
//         {
//             id: 10,
//             title: 'Nike Lite',
//             img: Box,

//             price: '9.99$',
//             color: 'green'

//         },
//         {
//             id: 11,
//             title: 'Nike Premium',
//             img: Box,

//             price: '49.99$',
//             color: 'blue'
//         },
//         {
//             id: 12,
//             title: 'Dior Budget',
//             img: Box,
//             price: '19.99$',
//             color: 'blue'
//         },
//         {
//             id: 13,
//             title: 'Supreme Lite',
//             img: Box,

//             price: '9.99$',
//             color: 'green'
//         },
//         {
//             id: 14,
//             title: 'Fear of God',
//             img: Box,

//             price: '11.99$',
//             color: 'blue'
//         },
//         {
//             id: 15,
//             title: 'Pokémon fan',
//             img: Box,

//             price: '4.99$',
//             color: 'green'
//         },
//         {
//             id: 16,
//             title: 'LV Luxury',
//             img: Box,

//             price: '89.99$',
//             color: 'purple'
//         },
//         {
//             id: 17,
//             title: 'Gucci Gucci ',
//             img: Box,
//             price: '74.99$',
//             color: 'purple'
//         },
//         {
//             id: 18,
//             title: 'Razer Box',
//             img: Box,

//             price: '49.99$',
//             color: 'blue'
//         },
//         {
//             id: 19,
//             title: 'Gamer Box ',
//             img: Box,

//             price: '9.99$',
//             color: 'green'
//         },
//         {
//             id: 20,
//             title: 'PC Budget',
//             img: Box,

//             price: '5.99$',
//             color: 'green'
//         },

//         {
//             id: 21,
//             title: 'PC Master',
//             img: Box,

//             price: '39.99$',
//             color: 'blue'
//         },

//         {
//             id: 22,
//             title: '10% PS5 ',
//             img: Box,

//             price: '9.99$',
//             color: 'green'
//         },

//         {
//             id: 24,
//             title: 'Xbox Lover',
//             img: Box,

//             price: '4.99$',
//             color: 'green'
//         },
//         {
//             id: 25,
//             title: 'Travis Premium',
//             img: Box,
//             price: '49.99$',
//             color: 'blue'
//         },
//         {
//             id: 26,
//             title: 'Off-White Lite',
//             img: Box,

//             price: '4.99$',
//             color: 'green'
//         },
//         {
//             id: 27,
//             title: 'Off-White Mega ',
//             img: Box,

//             price: '49.99$',
//             color: 'blue'
//         },




//         {
//             id: 28,
//             title: 'Lucky Games',
//             img: Box,

//             price: '3.99$',
//             color: 'green'
//         },
//         {
//             id: 29,
//             title: 'Movie lover ',
//             img: Box,

//             price: ' 14.99$',
//             color: 'blue'
//         },
//         {
//             id: 30,
//             title: 'Lego collector',
//             img: Box,

//             price: '7.99$',
//             color: 'green'
//         },
//         {
//             id: 31,
//             title: 'Cosmetic Box',
//             img: Box,

//             price: '6.99$',
//             color: 'green'
//         },

//         {
//             id: 32,
//             title: 'Hyboxes Favorite',
//             img: Box,
//             price: '9.99$',
//             color: 'green'
//         },

//         {
//             id: 33,
//             title: 'Playful Fun',
//             img: Box,
//             price: '34.99$',
//             color: 'blue'
//         },

//         {
//             id: 34,
//             title: 'Steam lover',
//             img: Box,
//             price: '2.49$',
//             color: 'green'
//         },


//         {
//             id: 35,
//             title: 'Switch On! ',
//             img: Box,
//             price: '7.99$',
//             color: 'green'
//         },



//         {
//             id: 36,
//             title: 'Metaverse ',
//             img: Box,
//             price: '44.99$',
//             color: 'blue'
//         },

//         {
//             id: 37,
//             title: ' Kaws Collector  ',
//             img: Box,
//             price: '99.99$',
//             color: 'purple'
//         },
//         // 36 boxes there are

//     ])
//     return (
//         <div className="flex-box-div">
//             {boxesname.map(box => (
//                 <div key={box.id} className={`subbox ${box.color}`}>
//                     <div className={`e-card playing ${box.color}`}>
//                         <div className="image">
//                             <img src={box.img} alt="" />
//                         </div>

//                         <div className="wave"></div>
//                         <div className="wave"></div>
//                         <div className="wave"></div>

//                         <div className="infotop">
//                             {/* <img src={box.img} alt="" /> */}
//                             <br />
//                             <span>  {box.title}  </span>
//                             <br />
//                             <div className="box-btn">
//                                 <ButtonOpen price={box.price} color={box.color} name={box.title} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };



// export default BoxCard;





import React from 'react';
import { Link } from 'react-router-dom';
import '../../style/boxcard.css';
import ButtonOpen from './btn';

// We accept { box } as a prop from MainPage
const BoxCard = ({ box }) => {

    // Since your API currently doesn't save a "color" field (like 'red', 'blue'),
    // we can default it to a specific class or generate one if needed.
    // For now, I'll set a default so the CSS still works.
    const boxColor = box.color || "blue"; 

    return (
        <div className={`subbox ${boxColor}`}>
            <div className={`e-card playing ${boxColor}`}>
                
                {/* 1. IMAGE FROM API */}
                <div className="image">
                    <img 
                        src={box.image} 
                        alt={box.name} 
                        style={{ objectFit: 'contain' }} // Ensures image fits nicely
                    />
                </div>

                {/* CSS Waves */}
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>

                <div className="infotop">
                    <br />
                    
                    {/* 2. TITLE FROM API */}
                    {/* We check for name OR title depending on what backend sends */}
                    <span>{box.name || box.title}</span>
                    
                    <br />
                    
                    <div className="box-btn">
                        {/* 3. LINK TO DETAIL PAGE */}
                        <Link to={`/box/${box.id}`} style={{ textDecoration: 'none' }}>
                            <ButtonOpen 
                                price={box.price} 
                                color={boxColor} 
                                name={box.name} 
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoxCard;