import React from 'react';
import './PageHeading.css';

const PageHeading = ({ title }) => {
    return (
        <div className="page-heading-container">
            <h1 className="reusable-page-heading">{title}</h1>
            <div className="heading-underline"></div>
        </div>
    );
};

export default PageHeading;
