import axios from "axios";

const api = axios.create({
    baseURL: 'https://localhost:44424',
})


// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Add bearer token to request for authorization
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor that will first try to get a new pair of tokens after an unauthorized request.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("The error that axios received:", error);
        const originalRequest = error.config;
        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and it needs to be refreshed
        if (error.response.status === 401 && !originalRequest._retry) {
            // The retry flags is set the to true at the first retry attempt
            originalRequest._retry = true;

            try {
                const currentRefreshToken = localStorage.getItem('refreshToken');
                console.log("Axios will run a call to /api/Authentication/RefreshToken");
                const currentToken = localStorage.getItem('token');
                const response = await axios.post('/api/Authentication/RefreshToken', { "Token": currentToken, "RefreshToken": currentRefreshToken });

                console.log("RefreshToken response: ", response)

                const newToken = response.data.token;
                const newRefreshToken = response.data.refreshToken;

                localStorage.setItem('token', newToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Retry the original request using the new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios(originalRequest);
            }
            catch (e) {
                console.log("Error after trying to refresh the tokens: ", e);
                return Promise.reject({ isTokenRefreshError: true });
            }
        }
        else if (error.response.status === 401 && originalRequest._retry) { // Unauthorized after a RefreshToken request
            console.log("Unauthorized after a refresh token request. returning isTokenRefreshError.");
            return Promise.reject({ isTokenRefreshError: true });
        }        
        if (error.response.status === 400) { // Refreshing tokens apparently returned an error
            try {
                console.log("400 error contents: ", error.response)
            }
            catch (e ){
                console.log("This is from the catch block in the 400 if statement: ", e);
            }
        }
        console.log("Something else happened :(");
        return Promise.reject(error);
    }
)

export default api
