import React from 'react';
import './BulbAnimation.css';

const BulbAnimation = () => {
    return (
        <div className="bulb-cont">
            <div className="bulb-container">
                <div className="wire"></div>
                <div className="connector">
                    <div className="grove"></div>
                    <div className="grove"></div>
                    <div className="grove"></div>
                </div>
                <div className="bulb">
                    <div className="metal-wire"></div>
                    <div className="metal-wire"></div>
                    <div className="metal-wire"></div>
                </div>
            </div>
        </div>

    );
};

export default BulbAnimation;