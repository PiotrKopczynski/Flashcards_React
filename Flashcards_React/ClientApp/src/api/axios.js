import axios from "axios";

/*export default axios.create({
    baseURL: 'http://localhost:5105'
})*/

const api = axios.create({
    baseURL: 'http://localhost:5105'
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

// Add a response interceptor that will first try to get a new pair of tokens after an uauthorized request.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and it needs to be refreshed
        if (error.response.status == 401 && !originalRequest._retry) {
            // The retry flags is set the to true at the first retry attempt
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('/api/Authentication/RefreshToken', {refreshToken});

                const token = response.data.token;
                const newRefreshToken = response.data.refreshToken;

                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Retry the original request using the new token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axios(originalRequest);
            }
            catch (e) {
                // Handle refresh token error or redirect to login
            }
        }
        
        return Promise.reject(error);
    }
)

export default api
