import React from 'react';
import './WaveAnimation.css';

const WaveAnimation = () => {
    return (
        <div>
            <svg id="waves-top"
                viewBox="0 0 960 170"
                width="960"
                height="170"
                version="1.1">
                <path className="red" d="M0 73L22.8 76.2C45.7 79.3 91.3 85.7 137 87.8C182.7 90 228.3 88 274 86.3C319.7 84.7 365.3 83.3 411.2 79.8C457 76.3 503 70.7 548.8 70.2C594.7 69.7 640.3 74.3 686 76.5C731.7 78.7 777.3 78.3 823 75.8C868.7 73.3 914.3 68.7 937.2 66.3L960 64L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#f7770f"></path>
                <path className="orange" d="M0 76L22.8 75.2C45.7 74.3 91.3 72.7 137 70.5C182.7 68.3 228.3 65.7 274 66.2C319.7 66.7 365.3 70.3 411.2 74C457 77.7 503 81.3 548.8 83C594.7 84.7 640.3 84.3 686 81.3C731.7 78.3 777.3 72.7 823 71.2C868.7 69.7 914.3 72.3 937.2 73.7L960 75L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#ea503e"></path>
                <path className="red" d="M0 61L22.8 58.8C45.7 56.7 91.3 52.3 137 53.3C182.7 54.3 228.3 60.7 274 64.7C319.7 68.7 365.3 70.3 411.2 71.7C457 73 503 74 548.8 71C594.7 68 640.3 61 686 58.8C731.7 56.7 777.3 59.3 823 59C868.7 58.7 914.3 55.3 937.2 53.7L960 52L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#cc3557"></path>
                <path className="orange" d="M0 40L22.8 42.3C45.7 44.7 91.3 49.3 137 53.5C182.7 57.7 228.3 61.3 274 62.2C319.7 63 365.3 61 411.2 56.7C457 52.3 503 45.7 548.8 46.5C594.7 47.3 640.3 55.7 686 56.8C731.7 58 777.3 52 823 50.2C868.7 48.3 914.3 50.7 937.2 51.8L960 53L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#a22c65"></path>
                <path className="red" d="M0 34L22.8 34.7C45.7 35.3 91.3 36.7 137 36.8C182.7 37 228.3 36 274 37.7C319.7 39.3 365.3 43.7 411.2 43.2C457 42.7 503 37.3 548.8 35C594.7 32.7 640.3 33.3 686 34.7C731.7 36 777.3 38 823 37.7C868.7 37.3 914.3 34.7 937.2 33.3L960 32L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#712c66"></path>
                <path className="orange" d="M0 25L22.8 26.8C45.7 28.7 91.3 32.3 137 34.5C182.7 36.7 228.3 37.3 274 36.8C319.7 36.3 365.3 34.7 411.2 33.3C457 32 503 31 548.8 31.3C594.7 31.7 640.3 33.3 686 32.3C731.7 31.3 777.3 27.7 823 27.8C868.7 28 914.3 32 937.2 34L960 36L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#412958"></path>
                <path className="red" d="M0 29L22.8 28.5C45.7 28 91.3 27 137 24.8C182.7 22.7 228.3 19.3 274 19.8C319.7 20.3 365.3 24.7 411.2 25.7C457 26.7 503 24.3 548.8 23.7C594.7 23 640.3 24 686 24.5C731.7 25 777.3 25 823 24.7C868.7 24.3 914.3 23.7 937.2 23.3L960 23L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#192040"></path>
                <path className="orange" d="M0 14L22.8 12.8C45.7 11.7 91.3 9.3 137 9.3C182.7 9.3 228.3 11.7 274 13.2C319.7 14.7 365.3 15.3 411.2 15.7C457 16 503 16 548.8 14.8C594.7 13.7 640.3 11.3 686 9.8C731.7 8.3 777.3 7.7 823 8.7C868.7 9.7 914.3 12.3 937.2 13.7L960 15L960 0L937.2 0C914.3 0 868.7 0 823 0C777.3 0 731.7 0 686 0C640.3 0 594.7 0 548.8 0C503 0 457 0 411.2 0C365.3 0 319.7 0 274 0C228.3 0 182.7 0 137 0C91.3 0 45.7 0 22.8 0L0 0Z" fill="#001122"></path>
            </svg>
        </div>
    );
};

export default WaveAnimation;