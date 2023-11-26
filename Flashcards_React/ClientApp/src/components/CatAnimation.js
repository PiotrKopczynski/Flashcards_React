import React, { useEffect } from 'react';
import './CatAnimation.css';

const CatAnimation = () => {
    useEffect(() => {
        // ensuring KUTE.js is loaded
        if (window.KUTE) {
            const morphing = window.KUTE.fromTo(
                '#blob1',
                { path: '#blob1' },
                { path: '#blob2' },
                { duration: 2000, easing: 'easingQuadraticOut' }
            );

            // Start the animation
            morphing.start();
        }
    }, []);

    return (
        <svg className="blob-motion"
            id="visual-cat"
            viewBox="0 0 800 500"
            version="1.1">
            <g transform="translate(480 270)">
                <path id="blob1"
                    d="M52 -57.5C67.6 -48.9 80.6 -32.7 81.7 -15.9C82.9 0.8 72.2 18.2 62.6 37.4C53 56.6 44.4 77.6 29.3 85.2C14.1 92.7 -7.6 86.8 -21.2 74.7C-34.8 62.6 -40.1 44.4 -50.3 28.3C-60.5 12.2 -75.6 -1.9 -73.7 -13C-71.8 -24.2 -52.9 -32.4 -37.8 -41.1C-22.7 -49.7 -11.4 -58.9 3.4 -63C18.2 -67 36.4 -66.1 52 -57.5"
                    style={{ fill: '#1a1a1a' }}>
                </path>
            </g>
            <g style={{ visibility: 'hidden' }}>
                <path id="blob2"
                    d="M96.6 141.667c-14.72-.67-27.964-3.9-38.46-9.378-5.894-3.076-9.834-5.957-14.312-10.46-3.386-3.407-5.743-6.51-7.566-9.962l-1.13-2.142.28-2.613c.962-8.98 3.459-19.012 6.68-26.838l1.269-3.083-.554-4.389c-.685-5.429-1.656-15.01-2.064-20.359-.42-5.517-.417-17.111.006-19.626.431-2.569 1.13-4.38 1.937-5.022.58-.461.856-.503 2.435-.373 7.321.606 19.584 6.458 35.28 16.837l4.633 3.064h36.93l4.332-2.887c13.963-9.304 25.421-15.078 32.974-16.617 4-.815 4.927-.629 5.826 1.173 1.196 2.395 1.6 6.667 1.414 14.917-.185 8.154-.76 15.226-2.27 27.939l-.64 5.385 1.35 3.392c3.349 8.42 5.748 18.26 6.636 27.212.16 1.613.148 1.66-1.073 4.023-4.65 9.007-14.59 17.544-26.217 22.515-10.238 4.378-20.932 6.632-34.636 7.3-5.554.27-6.947.27-13.06-.008zm1.052-16.747c1.736-.783 3.7-2.777 4.695-4.764.468-.937.852-1.853.852-2.036 0-.183.11-.333.243-.333.135 0 .244.137.244.305 0 .167.327.994.725 1.836.931 1.968 2.865 4.009 4.612 4.866 1.24.61 1.618.672 4.05.673 1.574 0 3.166-.14 3.853-.34 1.614-.468 3.425-2.132 3.928-3.607.488-1.435.498-2.85.022-3.245-.57-.472-1.03.083-1.22 1.472-.335 2.427-1.899 3.703-5.084 4.146-3.005.418-5.51-.406-7.247-2.386-1.524-1.735-2.892-5.611-2.903-8.226-.004-.905.158-1.135 2.368-3.353l2.373-2.382H97.722l2.372 2.382c2.687 2.697 2.7 2.737 2.008 6.009-1.23 5.806-4.755 8.672-9.788 7.958-2.093-.297-2.428-.41-3.44-1.158-.972-.72-1.424-1.556-1.649-3.056-.2-1.34-.658-1.87-1.216-1.406-.854.708-.169 3.686 1.169 5.08 1.616 1.683 3.391 2.238 6.877 2.15 1.873-.048 2.707-.184 3.597-.585zm-26.876-6.258c11.399-2.034 18.116-13.829 14.131-24.812-3.083-8.498-12.1-13.57-20.913-11.763-12.118 2.484-18.456 15.9-12.716 26.916 3.725 7.151 11.624 11.064 19.498 9.659zm-3.392-6.38c-8.259-2.222-12.01-11.868-7.393-19.011 3.017-4.669 9.18-6.874 14.563-5.211l1.64.506-.732.774c-1.053 1.113-1.344 1.802-1.365 3.231-.034 2.363 1.752 4.336 4.225 4.667.74.1 1.285-.023 2.294-.517.728-.356 1.385-.809 1.46-1.006.266-.69.58-.349.975 1.058.5 1.782.511 4.63.025 6.497-1.117 4.286-4.73 7.905-9.005 9.018-1.793.467-4.936.464-6.687-.007zm76.526 5.985c3.219-.904 5.455-2.25 8.066-4.858 1.99-1.987 2.497-2.666 3.469-4.643 1.514-3.082 1.962-5.041 1.954-8.534-.012-5.268-1.799-9.566-5.486-13.196-10.424-10.263-28.041-4.808-31.018 9.605-2.096 10.148 4.557 20.013 14.854 22.022 2.232.435 5.819.26 8.16-.396zm-11.426-5.97c-4.278-1.2-7.829-4.763-8.953-8.985-.448-1.68-.43-5.127.036-6.693.206-.695.414-1.264.462-1.264.048 0 .417.31.82.686.753.703 2.202 1.265 3.26 1.265.327 0 1.167-.285 1.865-.633 1.64-.817 2.483-2.157 2.483-3.944 0-1.56-.316-2.406-1.264-3.39l-.746-.773 1.64-.506c2.03-.627 5.298-.68 7.214-.118 4.512 1.326 8.1 5.044 9.024 9.35.418 1.95.167 5.7-.492 7.357-1.252 3.144-4.228 6.041-7.49 7.294-1.863.714-5.919.897-7.859.353zm-71.1-57.56c1.609-1.066 4.214-2.54 5.789-3.274 1.575-.735 2.863-1.391 2.863-1.458 0-.067-1.069-.688-2.375-1.38-4.815-2.552-9.657-4.228-12.212-4.228-1.03 0-1.334.114-1.951.73-1.673 1.673-2.447 6.979-2.115 14.5l.174 3.954 3.45-3.453c2.669-2.67 4.114-3.892 6.376-5.39zm94.14.144c-.146-5.055-.617-7.623-1.699-9.258-.367-.554-.916-1.041-1.275-1.131-1.007-.253-3.225.052-5.464.752-1.997.624-10.24 4.45-10.24 4.754 0 .081.96.555 2.133 1.052 4.735 2.007 9.288 5.256 13.508 9.639l2.767 2.874.2-2.086c.111-1.147.142-4.115.07-6.596z"
                    style={{ fill: '#1a1a1a' }} >
                </path>
            </g>
        </svg>
    );
};

export default CatAnimation;