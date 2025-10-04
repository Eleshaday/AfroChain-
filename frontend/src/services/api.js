const API_BASE_URL = 'http://localhost:4000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication methods
    async register(name, email, password) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    async updateProfile(name, email) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({ name, email }),
        });
    }

    // Cart methods
    async addToCart(coffeeType, quantity, price) {
        return this.request('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ coffeeType, quantity, price }),
        });
    }

    async getCart() {
        return this.request('/cart');
    }

    async clearCart() {
        return this.request('/cart/clear', {
            method: 'DELETE',
        });
    }

    // Logout
    logout() {
        this.setToken(null);
    }
}

export default new ApiService();
