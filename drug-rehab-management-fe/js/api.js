// Mocking API requests for frontend development before Java Spring Boot is ready.
// Later, these will be replaced by actual fetch() calls to CONFIG.BASE_API_URL
const Api = {
    async request(endpoint, options = {}) {
        const token = Auth.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const config = {
            ...options,
            headers
        };

        // TODO: Uncomment and use this when Java Backend is ready
        /*
        try {
            const response = await fetch(`${CONFIG.BASE_API_URL}${endpoint}`, config);
            if (!response.ok) {
                if(response.status === 401) Auth.logout();
                throw new Error(response.statusText);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
        */
        
        console.log(`[API MOCK] ${options.method || 'GET'} ${endpoint}`);
        return new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    },

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
    },

    put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
    },

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
};
