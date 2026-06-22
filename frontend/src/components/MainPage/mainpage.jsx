import React, { useState, useEffect } from 'react';
import BoxCard from "./boxcard";
import LiveDrop from "./livedrop/livedrop";
import CustomDropdown from './CustomDropdown'; // Import here
import '../../style/mainpage.css';
import api from '../../utils/api'; 
import CustomPagination from "../CustomPagination";

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
                        <CustomDropdown 
                            options={[
                                { value: 'high-low', label: 'HIGHEST TO LOWEST' },
                                { value: 'low-high', label: 'LOWEST TO HIGHEST' }
                            ]}
                            value={sortOrder}
                            onChange={(newValue) => setSortOrder(newValue)}
                        />
                    </div>
                </div>

                {/* 4. Display Logic */}
                <div className="main-page-div" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '20px', paddingLeft: '7%', paddingRight: '9.5%', paddingTop: '20px', paddingBottom: '20px' }}>
                    
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