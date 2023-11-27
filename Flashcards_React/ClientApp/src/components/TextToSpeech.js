import React, { useState, useEffect } from "react";

const TextToSpeech = ({ text }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);

    useEffect(() => {
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(text);

        setUtterance(u);

        return () => {
            synth.cancel();
        };
    }, [text]);

    const handlePlay = () => {
        const synth = window.speechSynthesis;

        if (isPaused) {
            synth.resume();
        }

        synth.speak(utterance);

        setIsPaused(true);
    };

    return (
        <div>
            <i className="fas fa-volume-up" onClick={handlePlay}></i>
        </div>
    );
};

export default TextToSpeech;
