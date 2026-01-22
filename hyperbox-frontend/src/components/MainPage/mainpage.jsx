import React, { useState, useEffect } from 'react';
import BoxCard from "./boxcard";
import LiveDrop from "./livedrop/livedrop";
import '../../style/mainpage.css';
import api from '../../utils/api'; // Ensure this points to your axios helper

import CustomPagination from "../CustomPagination"; // Adjust path if needed

export default function MainPage() {
    // 1. State for Data
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('high-low'); // Default sort
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // 2. Fetch Boxes on Load
    useEffect(() => {
        const fetchBoxes = async () => {
            try {
                const res = await api.get('/boxes'); // Matches your app.get('/api/boxes')
                setBoxes(res.data);
            } catch (err) {
                console.error("Error fetching boxes:", err);
                setError("Failed to load boxes.");
            } finally {
                setLoading(false);
            }
        };

        fetchBoxes();
    }, []);

    // 3. Sorting Logic
    const getSortedBoxes = () => {
        // Create a copy array to avoid mutating state directly
        const sorted = [...boxes];
        if (sortOrder === 'high-low') {
            return sorted.sort((a, b) => b.price - a.price);
        } else {
            return sorted.sort((a, b) => a.price - b.price);
        }
    };

    // Calculate Pagination
    const sortedBoxes = getSortedBoxes();
    const indexOfLastBox = currentPage * itemsPerPage;
    const indexOfFirstBox = indexOfLastBox - itemsPerPage;
    const currentBoxes = sortedBoxes.slice(indexOfFirstBox, indexOfLastBox);

    return (
        <>
            <div className="page-main">

                <div className="livedrop-div">
                    <LiveDrop />
                </div>
                
                <div className="main-heading">
                    <h2>Unbox Real-Life Items, and Get Them Shipped Directly To You!</h2>
                </div>

                <div className="btns-flex-div">
                    <div className="popular-all-mystery">
                        <div>
                            <button className="btn-all-mystery-box"> All Mystery Box </button>
                        </div>
                        <div>
                            <button className="btn-most-popular"> Most Popular </button>
                        </div>
                    </div>
                    <div>
                        {/* Update State on Change */}
                        <select 
                            name="boxes-choose" 
                            className="btn-select-box"
                            onChange={(e) => setSortOrder(e.target.value)}
                            value={sortOrder}
                        >
                            <option value="high-low">Highest to Lowest</option>
                            <option value="low-high">Lowest to Highest</option>
                        </select>
                    </div>
                </div>

                {/* 4. Display Logic */}
                <div className="main-page-div" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '20px' }}>
                    
                    {loading && (
                        <div className="loader-container">
                            <span className="loader"></span>
                            <h5 style={{color:'white', marginTop: '20px', letterSpacing:'1px', textTransform:'uppercase'}}>Loading Drops...</h5>
                        </div>
                    )}
                    
                    {error && <h3 style={{color:'red'}}>{error}</h3>}

                    {!loading && !error && currentBoxes.map((box) => (
                        // We pass the individual box data to the BoxCard component
                        <BoxCard key={box.id} box={box} />
                    ))}
                    
                    {!loading && boxes.length === 0 && <h3 style={{color:'white'}}>No boxes found.</h3>}

                </div>

                {/* Pagination Controls */}
                {!loading && !error && boxes.length > itemsPerPage && (
                    <div className="d-flex justify-content-center pb-5">
                         <CustomPagination 
                            itemsPerPage={itemsPerPage} 
                            totalItems={boxes.length} 
                            currentPage={currentPage} 
                            paginate={setCurrentPage} 
                        />
                    </div>
                )}

            </div>
        </>
    );
}