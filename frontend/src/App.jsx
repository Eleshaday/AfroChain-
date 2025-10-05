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
import './App.css';

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage on component mount
        const savedCart = localStorage.getItem('coffeeCart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [cartNotification, setCartNotification] = useState(0);
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);
    const [selectedCoffeeProduct, setSelectedCoffeeProduct] = useState(null);
    const [coffeeProducts, setCoffeeProducts] = useState([
        {
            id: 1,
            farmerName: "Sidama Coffee Farmers Cooperative Union",
            coffeeName: "Sidama Grade 1 Green Beans",
            origin: "Ethiopia - Sidama Region",
            roastLevel: "Green (Unroasted)",
            qualityLevel: "Grade 1 (Highest Quality)",
            description: "Premium Sidama coffee beans from the birthplace of coffee. Hand-picked from 80,000+ farmers in the Sidama region. Known for its bright acidity, floral notes, and wine-like characteristics.",
            price: "$18.50/lb",
            image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
            available: 100,
            certification: "Fair Trade Certified",
            farmId: "SIDAMA-001",
            harvestDate: "2024-01-15",
            batchId: "BATCH-SIDAMA-2024-001",
            nftId: "NFT-SIDAMA-001",
            authenticityVerified: true,
            supplyChainSteps: [
                { step: "Farm Harvest", timestamp: "2024-01-15T06:00:00Z", location: "Sidama Region, Ethiopia" },
                { step: "Processing", timestamp: "2024-01-16T08:00:00Z", location: "Sidama Processing Plant" },
                { step: "Quality Control", timestamp: "2024-01-17T10:00:00Z", location: "Ethiopian Coffee Authority" },
                { step: "Export Preparation", timestamp: "2024-01-18T12:00:00Z", location: "Addis Ababa Port" }
            ]
        },
        {
            id: 2,
            farmerName: "Yirgacheffe Coffee Farmers Union",
            coffeeName: "Yirgacheffe Grade 2 Green Beans",
            origin: "Ethiopia - Yirgacheffe",
            roastLevel: "Green (Unroasted)",
            qualityLevel: "Grade 2 (Premium Quality)",
            description: "Exceptional Yirgacheffe coffee with bright citrus and floral notes. Grown at high altitude (1,700-2,200m) with traditional processing methods.",
            price: "$16.75/lb",
            image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
            available: 75,
            certification: "Organic Certified",
            farmId: "YIRGACHEFFE-002",
            harvestDate: "2024-02-10",
            batchId: "BATCH-YIRGA-2024-002",
            nftId: "NFT-YIRGA-002",
            authenticityVerified: true,
            supplyChainSteps: [
                { step: "Farm Harvest", timestamp: "2024-02-10T06:30:00Z", location: "Yirgacheffe, Ethiopia" },
                { step: "Wet Processing", timestamp: "2024-02-11T07:00:00Z", location: "Yirgacheffe Processing Center" },
                { step: "Drying", timestamp: "2024-02-12T08:00:00Z", location: "Yirgacheffe Drying Beds" },
                { step: "Quality Control", timestamp: "2024-02-13T09:00:00Z", location: "Ethiopian Coffee Authority" }
            ]
        },
        {
            id: 3,
            farmerName: "Harrar Coffee Cooperative",
            coffeeName: "Harrar Longberry Green Beans",
            origin: "Ethiopia - Harrar Region",
            roastLevel: "Green (Unroasted)",
            qualityLevel: "Grade 3 (High Quality)",
            description: "Traditional Harrar coffee with blueberry and wine notes. Natural processed beans with distinctive fruity characteristics.",
            price: "$14.25/lb",
            image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
            available: 60,
            certification: "Direct Trade",
            farmId: "HARRAR-003",
            harvestDate: "2024-01-25",
            batchId: "BATCH-HARRAR-2024-003",
            nftId: "NFT-HARRAR-003",
            authenticityVerified: true,
            supplyChainSteps: [
                { step: "Farm Harvest", timestamp: "2024-01-25T05:00:00Z", location: "Harrar Region, Ethiopia" },
                { step: "Natural Processing", timestamp: "2024-01-26T06:00:00Z", location: "Harrar Processing Facility" },
                { step: "Sun Drying", timestamp: "2024-01-27T07:00:00Z", location: "Harrar Drying Patios" },
                { step: "Quality Control", timestamp: "2024-01-28T08:00:00Z", location: "Ethiopian Coffee Authority" }
            ]
        },
        {
            id: 4,
            farmerName: "Guji Coffee Farmers Association",
            coffeeName: "Guji Natural Process Green Beans",
            origin: "Ethiopia - Guji Zone",
            roastLevel: "Green (Unroasted)",
            qualityLevel: "Grade 1 (Highest Quality)",
            description: "Award-winning Guji coffee with complex fruit notes and clean finish. Natural processing enhances the inherent sweetness.",
            price: "$20.00/lb",
            image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
            available: 40,
            certification: "Rainforest Alliance",
            farmId: "GUJI-004",
            harvestDate: "2024-02-20",
            batchId: "BATCH-GUJI-2024-004",
            nftId: "NFT-GUJI-004",
            authenticityVerified: true,
            supplyChainSteps: [
                { step: "Farm Harvest", timestamp: "2024-02-20T05:30:00Z", location: "Guji Zone, Ethiopia" },
                { step: "Natural Processing", timestamp: "2024-02-21T06:30:00Z", location: "Guji Processing Center" },
                { step: "Extended Fermentation", timestamp: "2024-02-22T07:30:00Z", location: "Guji Fermentation Tanks" },
                { step: "Quality Control", timestamp: "2024-02-23T08:30:00Z", location: "Ethiopian Coffee Authority" }
            ]
        }
    ]);

    const addNewProduct = (newProduct) => {
        setCoffeeProducts([...coffeeProducts, { ...newProduct, id: coffeeProducts.length + 1 }]);
    };

    // Save cart to localStorage whenever cart changes
    const saveCartToStorage = (newCart) => {
        localStorage.setItem('coffeeCart', JSON.stringify(newCart));
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
        notification.textContent = `${product.coffeeName} added to cart!`;
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
        // Cart persists even after "logout" because it's stored in localStorage
        alert('Logged out! Your cart is still saved in your browser.');
    };

    const simulateLogin = () => {
        // Cart is automatically loaded from localStorage on "login"
        alert('Logged in! Your saved cart has been restored.');
    };

    const handleVerifyAuthenticity = async (batchId) => {
        try {
            const result = await fetch(`http://localhost:4000/api/verify/${batchId}`)
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
            />
            <main>
                {currentPage === 'home' && <HomePage 
                    products={coffeeProducts} 
                    onAddToCart={addToCart}
                    onVerifyProduct={(batchId) => {
                        const product = coffeeProducts.find(p => p.batchId === batchId);
                        setSelectedBatchId(batchId);
                        setSelectedCoffeeProduct(product);
                        setVerificationResult(null);
                        setCurrentPage('verify');
                    }}
                />}
                {currentPage === 'products' && <ProductsPage 
                    products={coffeeProducts} 
                    onAddToCart={addToCart}
                    onVerifyProduct={(batchId) => {
                        const product = coffeeProducts.find(p => p.batchId === batchId);
                        setSelectedBatchId(batchId);
                        setSelectedCoffeeProduct(product);
                        setVerificationResult(null);
                        setCurrentPage('verify');
                    }}
                />}
                {currentPage === 'cart' && <CartPage 
                    cart={cart} 
                    onRemoveFromCart={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    onProceedToBuy={() => setCurrentPage('checkout')}
                    totalPrice={getTotalPrice()}
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
                {currentPage === 'transactions' && <TransactionHistory />}
                {currentPage === 'verify' && <AuthenticityVerifier 
                    batchId={selectedBatchId}
                    onVerify={handleVerifyAuthenticity}
                    verificationResult={verificationResult}
                    coffeeProduct={selectedCoffeeProduct}
                />}
                {currentPage === 'escrow' && <SmartEscrow onBack={() => setCurrentPage('home')} />}
                {currentPage === 'loyalty' && <LoyaltySystem onBack={() => setCurrentPage('home')} />}
                {currentPage === 'farmers' && <FarmerReputation onBack={() => setCurrentPage('home')} />}
                {currentPage === 'sustainability' && <SustainabilityTracker onBack={() => setCurrentPage('home')} />}
            </main>
        </div>
    );
}
