import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import TransactionHistory from './components/TransactionHistory';
import AuthenticityVerifier from './components/AuthenticityVerifier';
import SmartEscrow from './components/SmartEscrow';
import LoyaltySystem from './components/LoyaltySystem';
import FarmerReputation from './components/FarmerReputation';
import SustainabilityTracker from './components/SustainabilityTracker';
import DeliveryTracker from './components/DeliveryTracker';
import './App.css';
import WalletConnect from './components/WalletConnect';
import { mockProducts } from './data/mockProducts';

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('authUser');
        return saved ? JSON.parse(saved) : null;
    });
    const [pendingRedirect, setPendingRedirect] = useState(null);
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage on component mount
        const savedCart = localStorage.getItem('farmerchainCart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [cartNotification, setCartNotification] = useState(0);
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);
    const [selectedAgriculturalProduct, setSelectedAgriculturalProduct] = useState(null);
    const [agriculturalProducts, setAgriculturalProducts] = useState(mockProducts);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const addNewProduct = (newProduct) => {
        setAgriculturalProducts([...agriculturalProducts, { ...newProduct, id: agriculturalProducts.length + 1 }]);
    };

    // Save cart to localStorage whenever cart changes
    const saveCartToStorage = (newCart) => {
        localStorage.setItem('farmerchainCart', JSON.stringify(newCart));
        setCart(newCart);
    };

    const addToCart = (product, quantity = 1) => {
        const existingItem = cart.find(item => item.id === product.id);
        let newCart;
        
        if (existingItem) {
            newCart = cart.map(item => 
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            newCart = [...cart, { ...product, quantity }];
        }
        
        saveCartToStorage(newCart);
        setCartNotification(cartNotification + 1);
        
        // Show notification
        const notification = document.createElement('div');
        notification.textContent = `${product.productName} added to cart!`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    const removeFromCart = (productId) => {
        const newCart = cart.filter(item => item.id !== productId);
        saveCartToStorage(newCart);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            const newCart = cart.map(item => 
                item.id === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            saveCartToStorage(newCart);
        }
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0);
    };

    const clearCart = () => {
        saveCartToStorage([]);
        setCartNotification(0);
    };

    // Simulate logout/login functionality
    const simulateLogout = () => {
        setUser(null);
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
        setCurrentPage('home');
        // No alert needed - clean disconnect
    };

    const simulateLogin = () => {
        setCurrentPage('login');
    };

    const handleLogin = (userObj, token, { redirectTo, redirectState } = {}) => {
        setUser(userObj);
        localStorage.setItem('authUser', JSON.stringify(userObj));
        localStorage.setItem('authToken', token); // Store JWT token
        const target = redirectTo || pendingRedirect?.redirectTo || 'home';
        const state = redirectState || pendingRedirect?.redirectState || null;
        setPendingRedirect(null);
        if (target === 'verify' && state?.batchId) {
            setSelectedBatchId(state.batchId);
            const product = agriculturalProducts.find(p => p.batchId === state.batchId);
            setSelectedAgriculturalProduct(product || null);
        }
        setCurrentPage(target);
    };

    const handleSignupSuccess = (data) => {
        // This function is no longer needed with wallet authentication
        // Users are automatically created when they authenticate with wallet
        console.log('Signup success - wallet authentication handles user creation');
    };

    const handleVerifyAuthenticity = async (batchId) => {
        try {
            const result = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/verify/${batchId}`)
                .then(res => res.json());
            setVerificationResult(result);
        } catch (error) {
            console.warn('Backend not available, using mock verification:', error);
            // Fallback to mock verification data
            const mockResult = {
                success: true,
                valid: true,
                batchId: batchId,
                nftId: 'NFT-SIDAMA-001',
                verification: {
                    status: 'AUTHENTIC',
                    confidence: 95,
                    checks: [
                        { name: 'Blockchain Hash', status: 'VALID' },
                        { name: 'NFT Certificate', status: 'VERIFIED' },
                        { name: 'Supply Chain', status: 'TRACEABLE' },
                        { name: 'Origin Verification', status: 'CONFIRMED' }
                    ]
                },
                coffeeData: {
                    farmName: 'Sidama Coffee Farmers Cooperative',
                    origin: 'Sidama Region, Ethiopia',
                    farmerName: 'Alemayehu Bekele',
                    harvestDate: '2024-01-15',
                    qualityGrade: 'Grade 1',
                    processingMethod: 'Washed',
                    elevation: '1800-2000m',
                    certification: 'Organic Certified'
                },
                verificationHash: 'mock-verification-hash-12345',
                confidenceScore: 95,
                antiFraudStatus: 'CLEAR',
                transactionHash: 'mock-tx-hash-67890',
                timestamp: new Date().toISOString(),
                network: 'Hedera (Mock)'
            };
            setVerificationResult(mockResult);
        }
    };

    return (
        <div className="app">
            <Header 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                cartCount={cart.length}
                cartNotification={cartNotification}
                onLogout={simulateLogout}
                onLogin={simulateLogin}
                setSelectedBatchId={setSelectedBatchId}
                setVerificationResult={setVerificationResult}
                user={user}
            />
            <main>
                {currentPage === 'home' && <HomePage 
                    products={agriculturalProducts} 
                    onAddToCart={addToCart}
                    onVerifyProduct={(batchId) => {
                        if (!user) {
                            setPendingRedirect({ redirectTo: 'verify', redirectState: { batchId } });
                            setCurrentPage('login');
                            return;
                        }
                        const product = agriculturalProducts.find(p => p.batchId === batchId);
                        setSelectedBatchId(batchId);
                        setSelectedAgriculturalProduct(product);
                        setVerificationResult(null);
                        setCurrentPage('verify');
                    }}
                    setCurrentPage={setCurrentPage}
                    user={user}
                    cartCount={cart.length}
                    onLogout={simulateLogout}
                />}
                {currentPage === 'products' && <ProductsPage 
                    products={agriculturalProducts} 
                    onAddToCart={addToCart}
                    onVerifyProduct={(batchId) => {
                        if (!user) {
                            setPendingRedirect({ redirectTo: 'verify', redirectState: { batchId } });
                            setCurrentPage('login');
                            return;
                        }
                        const product = agriculturalProducts.find(p => p.batchId === batchId);
                        setSelectedBatchId(batchId);
                        setSelectedAgriculturalProduct(product);
                        setVerificationResult(null);
                        setCurrentPage('verify');
                    }}
                />}
                {currentPage === 'login' && (
                    <WalletConnect 
                        onLogin={handleLogin}
                        redirectTo={pendingRedirect?.redirectTo}
                        redirectState={pendingRedirect?.redirectState}
                    />
                )}
                {currentPage === 'cart' && <CartPage 
                    cart={cart} 
                    onRemoveFromCart={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    onProceedToBuy={() => setCurrentPage('checkout')}
                    totalPrice={getTotalPrice()}
                    setCurrentPage={setCurrentPage}
                />}
                {currentPage === 'checkout' && <CheckoutPage 
                    cart={cart}
                    totalPrice={getTotalPrice()}
                    onBackToCart={() => setCurrentPage('cart')}
                    onPaymentSuccess={() => {
                        clearCart();
                        setCurrentPage('transactions');
                    }}
                />}
                {currentPage === 'transactions' && <TransactionHistory onTrackOrder={(orderId) => {
                    setSelectedOrderId(orderId);
                    setCurrentPage('delivery');
                }} />}
                {currentPage === 'delivery' && <DeliveryTracker 
                    orderId={selectedOrderId}
                    onBack={() => setCurrentPage('transactions')}
                />}
                {currentPage === 'verify' && <AuthenticityVerifier 
                    batchId={selectedBatchId}
                    onVerify={handleVerifyAuthenticity}
                    verificationResult={verificationResult}
                    agriculturalProduct={selectedAgriculturalProduct}
                />}
                {currentPage === 'escrow' && <SmartEscrow onBack={() => setCurrentPage('home')} />}
                {currentPage === 'loyalty' && <LoyaltySystem onBack={() => setCurrentPage('home')} />}
                {currentPage === 'farmers' && <FarmerReputation onBack={() => setCurrentPage('home')} />}
                {currentPage === 'sustainability' && <SustainabilityTracker onBack={() => setCurrentPage('home')} />}
                    
            </main>
        </div>
    );
}
