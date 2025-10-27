// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API utility functions
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...defaultOptions, ...options });
    return response.json();
};

// Specific API functions
export const deployContract = async (contractData) => {
    return apiRequest('/api/deploy', {
        method: 'POST',
        body: JSON.stringify(contractData),
    });
};

export const releaseFunds = async (contractAddress) => {
    return apiRequest('/api/release', {
        method: 'POST',
        body: JSON.stringify({ contractAddress }),
    });
};

export const refundBuyer = async (contractAddress) => {
    return apiRequest('/api/refund', {
        method: 'POST',
        body: JSON.stringify({ contractAddress }),
    });
};

export const createNFTCertificate = async (productData) => {
    return apiRequest('/api/create-nft-certificate', {
        method: 'POST',
        body: JSON.stringify(productData),
    });
};

export const generateAuthenticity = async (batchId) => {
    return apiRequest('/api/generate-authenticity', {
        method: 'POST',
        body: JSON.stringify({ batchId }),
    });
};

export const verifyProduct = async (batchId, nftId = null) => {
    const url = nftId ? `/api/verify/${batchId}?nftId=${nftId}` : `/api/verify/${batchId}`;
    return apiRequest(url);
};

export const getProducts = async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/api/products?${queryParams}` : '/api/products';
    return apiRequest(url);
};

export const getProductCategories = async () => {
    return apiRequest('/api/products/categories');
};

export const createProduct = async (productData) => {
    return apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
    });
};

export const updateProduct = async (productId, productData) => {
    return apiRequest(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    });
};

export const deleteProduct = async (productId) => {
    return apiRequest(`/api/products/${productId}`, {
        method: 'DELETE',
    });
};

export const getProductsByFarmer = async (walletAddress) => {
    return apiRequest(`/api/products/farmer/${walletAddress}`);
};

export const getProductsByCategory = async (category) => {
    return apiRequest(`/api/products/category/${category}`);
};

// Wallet authentication
export const generateAuthMessage = async (walletAddress) => {
    return apiRequest('/api/auth/wallet/message', {
        method: 'POST',
        body: JSON.stringify({ walletAddress }),
    });
};

export const authenticateWallet = async (walletAddress, signature, message) => {
    return apiRequest('/api/auth/wallet/authenticate', {
        method: 'POST',
        body: JSON.stringify({ walletAddress, signature, message }),
    });
};

export const updateUserProfile = async (walletAddress, profileData) => {
    return apiRequest('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ walletAddress, ...profileData }),
    });
};

export const getUserProfile = async (walletAddress) => {
    return apiRequest(`/api/auth/profile/${walletAddress}`);
};

// Payment processing
export const processPayment = async (paymentData) => {
    return apiRequest('/api/process-payment', {
        method: 'POST',
        body: JSON.stringify(paymentData),
    });
};

export const processTokenPayment = async (paymentData) => {
    return apiRequest('/api/tokens/payment', {
        method: 'POST',
        body: JSON.stringify(paymentData),
    });
};

export const getLoyaltyBalance = async (userAccountId, tokenId) => {
    return apiRequest(`/api/tokens/balance/${userAccountId}/${tokenId}`);
};

export const rewardLoyaltyTokens = async (userAccountId, amount) => {
    return apiRequest('/api/tokens/loyalty/reward', {
        method: 'POST',
        body: JSON.stringify({ userAccountId, amount }),
    });
};

// Supply chain
export const getSupplyChainData = async (batchId) => {
    return apiRequest(`/api/supply-chain/${batchId}`);
};
