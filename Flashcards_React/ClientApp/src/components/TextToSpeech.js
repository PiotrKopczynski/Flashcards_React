// TextToSpeech.js
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faVolumeMute, faLanguage } from "@fortawesome/free-solid-svg-icons";

const TextToSpeech = ({ text, isLanguageFlashcard, settings, utterance }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const synth = window.speechSynthesis;

        const handleVoicesChanged = () => {
            const availableVoices = synth.getVoices();
            setVoices(availableVoices);
        };

        synth.addEventListener("voiceschanged", handleVoicesChanged);

        return () => {
            synth.removeEventListener("voiceschanged", handleVoicesChanged);
        };
    }, []); // Only run this effect once when the component mounts

    useEffect(() => {
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(text);

        utterance.current = u;

        return () => {
            synth.cancel();
        };
    }, [text, utterance]);

    const handlePlayToggle = () => {
        const synth = window.speechSynthesis;
        const currentUtterance = utterance.current;

        if (isPaused) {
            synth.resume();
        } else {
            currentUtterance.voice = settings.voice; // Set the selected voice
            currentUtterance.pitch = settings.pitch; // Set pitch
            currentUtterance.rate = settings.rate; // Set rate
            currentUtterance.volume = settings.volume; // Set volume
            synth.speak(currentUtterance);
        }

        setIsPaused(!isPaused);
    };

    const handleVoiceChange = (selectedVoice) => {
        if (selectedVoice) {
            settings.voice = selectedVoice;
            utterance.current.voice = selectedVoice;
        }

        setShowVoiceDropdown(false); // Hide the voice selection dropdown
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            // Clicked outside the dropdown, hide it
            setShowVoiceDropdown(false);
        }
    };

    useEffect(() => {
        // Attach event listener for clicks outside the dropdown
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            // Remove event listener on component unmount
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleVoiceDropdown = () => {
        setShowVoiceDropdown(!showVoiceDropdown);
    };

    return (
        <div>
            {isLanguageFlashcard && (
                <>
                    <label>
                        <FontAwesomeIcon
                            icon={faLanguage}
                            onClick={toggleVoiceDropdown}
                            size="2x" />
                        {showVoiceDropdown && (
                            <select
                                ref={dropdownRef}
                                onChange={(e) => handleVoiceChange(e.target.value)}
                            >
                                {voices.map((v) => (
                                    <option key={v.name} value={v.name}>
                                        {v.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </label>

                    <br />

                    <button
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                        }}
                        onClick={handlePlayToggle}
                    >
                        <FontAwesomeIcon
                            icon={isPaused ? faVolumeUp : faVolumeMute}
                            size="2x"
                        />
                    </button>
                </>
            )}
        </div>
    );
};

export default TextToSpeech;
