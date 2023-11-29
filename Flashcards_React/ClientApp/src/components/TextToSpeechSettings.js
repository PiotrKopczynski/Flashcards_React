import React, { useState } from "react";
import './TextToSpeechSettings.css'; 

const TextToSpeechSettings = ({ onUpdateSettings }) => {
    const [pitch, setPitch] = useState(1);
    const [rate, setRate] = useState(1);
    const [volume, setVolume] = useState(1);

    const handlePitchChange = (event) => {
        setPitch(parseFloat(event.target.value));
        onUpdateSettings({ pitch: parseFloat(event.target.value)}); 
    };

    const handleRateChange = (event) => {
        setRate(parseFloat(event.target.value));
        onUpdateSettings({ rate: parseFloat(event.target.value) }); 
    };

    const handleVolumeChange = (event) => {
        setVolume(parseFloat(event.target.value));
        onUpdateSettings({ volume: parseFloat(event.target.value) }); 
    };

    return (
        <div className="text-center mb-4">
            <label>
                Pitch:
                <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={handlePitchChange}
                />
            </label>

            <br />

            <label>
                Speed:
                <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={handleRateChange}
                />
            </label>
            <br />

            <label>
                Volume:
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </label>

        </div>
    );
};

export default TextToSpeechSettings;
