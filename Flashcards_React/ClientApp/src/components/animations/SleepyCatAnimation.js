import React from 'react';
import './SleepyCatAnimation.css'

const SleepyCatAnimation = () => {
    return (
        <div className="cat-container">
            <div className="cat-shadow"></div>
            <div className="cat">
                <div className="ear"></div>
                <div className="eye"></div>
                <div className="mouth"></div>
                <div className="nose"></div>
                <div className="tail"></div>
                <div className="cat-body"></div>
                <div className="cat-bubble"></div>
            </div>
        </div>
    );
};

export default SleepyCatAnimation;