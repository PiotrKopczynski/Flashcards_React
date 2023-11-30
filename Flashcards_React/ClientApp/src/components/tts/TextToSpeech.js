import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faVolumeMute, faLanguage } from "@fortawesome/free-solid-svg-icons";

const TextToSpeech = ({ text, isLanguageFlashcard, settings }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
    const [voices, setVoices] = useState([]);
    const utteranceRef = useRef(new SpeechSynthesisUtterance()); // Initialize with a ref
    const dropdownRef = useRef();

    const handlePlayToggle = () => {
        const synth = window.speechSynthesis;
        const currentUtterance = utteranceRef.current;

        if (isPaused) {
            synth.resume();
        } else {
            currentUtterance.text = text;
            currentUtterance.voice = settings.voice;
            currentUtterance.pitch = settings.pitch;
            currentUtterance.rate = settings.rate;
            currentUtterance.volume = settings.volume;
            synth.speak(currentUtterance);
        }

        setIsPaused(!isPaused);
    };

    const toggleVoiceDropdown = () => {
        setShowVoiceDropdown(!showVoiceDropdown);
    };

    const handleVoiceChange = (voiceName) => {
        const synth = window.speechSynthesis;
        const selectedVoice = voices.find((voice) => voice.name === voiceName);

        if (selectedVoice) {
            settings.voice = selectedVoice;
            utteranceRef.current.voice = selectedVoice;
        }

        setShowVoiceDropdown(false);
    };

    useEffect(() => {
        const synth = window.speechSynthesis;
        setVoices(synth.getVoices());

        const voiceChangeHandler = () => {
            setVoices(synth.getVoices());
        };

        synth.addEventListener("voiceschanged", voiceChangeHandler);

        return () => {
            synth.removeEventListener("voiceschanged", voiceChangeHandler);
            synth.cancel();
        };
    }, []);

    return (
        <div>
            <button
                style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#712c66",
                }}
                onClick={handlePlayToggle}
            >
                <FontAwesomeIcon icon={isPaused ? faVolumeUp : faVolumeMute} size="2x" />
            </button>

            <FontAwesomeIcon
                icon={faLanguage}
                onClick={toggleVoiceDropdown}
                size="2x"
                style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                }}
            />

            {showVoiceDropdown && (
                <select
                    ref={dropdownRef}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                >
                    {voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                            {voice.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default TextToSpeech;
