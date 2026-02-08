import React, { useState, useRef, useEffect } from 'react';
import '../../style/CustomDropdown.css';

const CustomDropdown = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || "Select Option";

    return (
        <div className="custom-dropdown-container" ref={dropdownRef}>
            {/* Header / Trigger */}
            <div 
                className={`dropdown-header ${isOpen ? 'open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedLabel}</span>
                <i className={`dropdown-arrow ${isOpen ? 'open' : ''}`}></i>
            </div>

            {/* List Items */}
            <ul className={`dropdown-list ${isOpen ? 'open' : ''}`}>
                {options.map((option) => (
                    <li 
                        key={option.value} 
                        className={`dropdown-item ${value === option.value ? 'selected' : ''}`}
                        onClick={() => {
                            onChange(option.value);
                            setIsOpen(false);
                        }}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomDropdown;
