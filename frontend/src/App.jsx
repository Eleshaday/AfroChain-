import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import FarmerPost from './components/FarmerPost';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import './App.css';

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [cart, setCart] = useState([]);
    const [cartNotification, setCartNotification] = useState(0);
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
            certification: "Fair Trade Certified"
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
            certification: "Organic Certified"
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
            certification: "Direct Trade"
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
            certification: "Rainforest Alliance"
        }
    ]);

    const addNewProduct = (newProduct) => {
        setCoffeeProducts([...coffeeProducts, { ...newProduct, id: coffeeProducts.length + 1 }]);
    };

    const addToCart = (product, quantity = 1) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item => 
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity }]);
        }
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
        setCart(cart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(cart.map(item => 
                item.id === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0);
    };

    return (
        <div className="app">
            <Header 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                cartCount={cart.length}
                cartNotification={cartNotification}
            />
            <main>
                {currentPage === 'home' && <HomePage products={coffeeProducts} onAddToCart={addToCart} />}
                {currentPage === 'products' && <ProductsPage products={coffeeProducts} onAddToCart={addToCart} />}
                {currentPage === 'farmer-post' && <FarmerPost onAddProduct={addNewProduct} />}
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
                />}
            </main>
        </div>
    );
}
