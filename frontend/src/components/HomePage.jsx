import React, { useState, useEffect } from 'react';
import ProductCategories from './ProductCategories';

export default function HomePage({ products, onAddToCart, onVerifyProduct, setCurrentPage, user, cartCount, onLogout }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Filter products by selected category
    const filteredProducts = selectedCategory
        ? products.filter(product => product.category === selectedCategory)
        : products;

    const featuredProducts = filteredProducts.slice(0, 6); // Show first 6 products as featured

    const handleCategorySelect = (category) => {
        setSelectedCategory(category === selectedCategory ? '' : category);
    };

    useEffect(() => {
        // Scroll animations for product cards
        const setupScrollAnimations = () => {
            const productCards = document.querySelectorAll('.product-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            productCards.forEach((card, index) => {
                card.style.opacity = 0;
                card.style.transform = 'translateY(20px)';
                card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
                observer.observe(card);
            });
        };

        setupScrollAnimations();
    }, [featuredProducts]);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                <h1 className="hero-title">
                        🌾 Welcome to FarmerChain
                </h1>
                <p className="hero-subtitle">
                        Decentralized Agricultural Marketplace - Direct from Farm to Table
                    </p>
                    <button onClick={() => setCurrentPage('products')} className="btn btn-outline btn-large" style={{width: 'auto', display: 'inline-block'}}>
                        EXPLORE PRODUCTS
                    </button>
                </div>
            </section>
            
            {/* Promo Section */}
            <section className="promo-section">
                <div className="container promo-content">
                    <h2>15% Off Your First Order</h2>
                    <p>Discover authentic agricultural products directly from farmers with our introductory offer</p>
                    <button onClick={() => setCurrentPage('products')} className="btn btn-secondary">SHOP NOW</button>
            </div>
            </section>

            {/* Product Categories */}
            <ProductCategories
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
            />

            {/* Featured Products Section */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            {selectedCategory ? `Featured ${selectedCategory}` : 'Our Agricultural Products'}
                        </h2>
                        <p>Discover the finest selection of products sourced directly from farmers</p>
                    </div>
                    
                <div className="products-grid">
                    {featuredProducts.map((product, index) => (
                        <div 
                            key={product.id} 
                            className="product-card"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <img 
                                src={product.image} 
                                    alt={product.productName || product.coffeeName}
                                className="product-image"
                            />
                            <div className="product-info">
                                <h3 className="product-name">
                                        {product.productName || product.coffeeName}
                                </h3>
                                <p className="product-origin">
                                    🌍 {product.origin}
                                </p>
                                <p className="product-description">
                                    {product.description}
                                </p>
                                
                                <div className="product-badges">
                                        {product.category && (
                                            <span className="category-badge">
                                                {product.category}
                                            </span>
                                        )}
                                        <span className={`quality-badge quality-${product.qualityLevel?.toLowerCase().replace(' ', '-')}`}>
                                        {product.qualityLevel}
                                    </span>
                                    {product.certification && (
                                        <span className="certification-badge">
                                            {product.certification}
                                        </span>
                                    )}
                                </div>
                                    <div className="product-price">
                                        {product.price}
                                </div>
                                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
                                    <button 
                                        onClick={() => onAddToCart(product)}
                                            className="add-to-cart-btn"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => onVerifyProduct(product.batchId)}
                                            className="verify-btn"
                                        >
                                            Verify Authenticity
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose FarmerChain?</h2>
                        <p>We're committed to ethical sourcing and exceptional quality</p>
                    </div>
                    
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-leaf"></i>
                            </div>
                            <h3>Sustainable Farming</h3>
                            <p>We partner with farmers who use environmentally responsible practices that protect our ecosystems.</p>
                        </div>
                        
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-hand-holding-usd"></i>
                            </div>
                            <h3>Fair Prices</h3>
                            <p>Farmers receive fair compensation for their harvest, supporting thriving rural communities.</p>
                        </div>
                        
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-shipping-fast"></i>
                </div>
                            <h3>Fresh Products</h3>
                            <p>We ensure peak freshness in every product, shipped directly from farm to your table.</p>
            </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-seedling"></i>
                            </div>
                            <h3>Direct Relationships</h3>
                            <p>We build long-term partnerships with farmers, visiting farms regularly to ensure quality.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <h3>FarmerChain</h3>
                            <p>Connecting consumers with sustainable farmers worldwide. Taste the authentic flavors from farms around the globe.</p>
                            <div className="social-links">
                                <a href="#"><i className="fab fa-facebook-f"></i></a>
                                <a href="#"><i className="fab fa-instagram"></i></a>
                                <a href="#"><i className="fab fa-pinterest"></i></a>
                                <a href="#"><i className="fab fa-tiktok"></i></a>
                            </div>
                        </div>
                        
                        <div className="footer-col">
                            <h3>Shop</h3>
                            <ul className="footer-links">
                                <li><a href="#">All Products</a></li>
                                <li><a href="#">Coffee</a></li>
                                <li><a href="#">Grains</a></li>
                                <li><a href="#">Vegetables</a></li>
                                <li><a href="#">Fruits</a></li>
                            </ul>
                        </div>
                        
                        <div className="footer-col">
                            <h3>Help</h3>
                            <ul className="footer-links">
                                <li><a href="#">Contact Us</a></li>
                                <li><a href="#">Shipping & Returns</a></li>
                                <li><a href="#">Product Guides</a></li>
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">Track Order</a></li>
                            </ul>
                        </div>
                        
                        <div className="footer-col">
                            <h3>Contact</h3>
                            <ul className="footer-links">
                                <li><i className="fas fa-map-marker-alt"></i> Global Marketplace</li>
                                <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
                                <li><i className="fas fa-envelope"></i> hello@farmerchain.com</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="copyright">
                        <p>&copy; 2024 FarmerChain. All rights reserved. Proudly supporting farmers worldwide.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}