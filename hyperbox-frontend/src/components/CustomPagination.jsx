import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // If there's only 1 page, don't show pagination
    if (totalPages <= 1) return null;

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="d-flex justify-content-center mt-4">
            <Pagination>
                <Pagination.Prev 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1} 
                />
                
                {pageNumbers.map(number => (
                    <Pagination.Item 
                        key={number} 
                        active={number === currentPage} 
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </Pagination.Item>
                ))}

                <Pagination.Next 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages} 
                />
            </Pagination>
        </div>
    );
};

export default CustomPagination;