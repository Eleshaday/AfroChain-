import React from 'react';

export default function HomePage({ products, onAddToCart }) {
    const featuredProducts = products.slice(0, 3); // Show first 3 products as featured

    return (
        <div>
            {/* Hero Section */}
            <div className="hero-section">
                <h1 className="hero-title">
                    ☕ Welcome to CoffeeDirect
                </h1>
                <p className="hero-subtitle">
                    Premium Ethiopian Coffee - Direct from Farm to Cup
                </p>
            </div>

            {/* Featured Products Section */}
            <div className="featured-section">
                <h2 className="section-title">Featured Coffee</h2>
                <div className="products-grid">
                    {featuredProducts.map((product, index) => (
                        <div 
                            key={product.id} 
                            className="product-card"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <img 
                                src={product.image} 
                                alt={product.coffeeName}
                                className="product-image"
                            />
                            <div className="product-info">
                                <h3 className="product-name">
                                    {product.coffeeName}
                                </h3>
                                <p className="product-origin">
                                    🌍 {product.origin}
                                </p>
                                <p className="product-description">
                                    {product.description}
                                </p>
                                
                                <div className="product-badges">
                                    <span className={`quality-badge quality-${product.qualityLevel.toLowerCase().replace(' ', '-')}`}>
                                        {product.qualityLevel}
                                    </span>
                                    {product.certification && (
                                        <span className="certification-badge">
                                            {product.certification}
                                        </span>
                                    )}
                                </div>
                                
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    <span className="product-price">
                                        {product.price}
                                    </span>
                                    <span style={{
                                        color: product.available ? 'var(--success-color)' : 'var(--error-color)',
                                        fontWeight: '600',
                                        fontSize: '0.9rem'
                                    }}>
                                        {product.available ? '✅ In Stock' : '❌ Out of Stock'}
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={() => onAddToCart(product)}
                                    disabled={!product.available}
                                    className="add-to-cart-btn"
                                    style={{
                                        background: product.available ? 'var(--gradient-primary)' : '#6c757d',
                                        cursor: product.available ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    {product.available ? '🛒 Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* About Section */}
            <div style={{ 
                background: 'var(--card-background)', 
                padding: '4rem 2rem', 
                textAlign: 'center',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow-light)',
                border: '1px solid var(--border-color)',
                marginTop: '3rem'
            }}>
                <h2 className="section-title">
                    Why Choose CoffeeDirect?
                </h2>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '2rem',
                    marginTop: '2rem'
                }}>
                    <div className="hover-lift" style={{
                        background: 'var(--background-color)',
                        padding: '2rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)',
                        transition: 'var(--transition)'
                    }}>
                        <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '1.3rem' }}>🌱 Direct from Farmers</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Buy coffee beans directly from farmers, ensuring fair prices and supporting local communities.</p>
                    </div>
                    <div className="hover-lift" style={{
                        background: 'var(--background-color)',
                        padding: '2rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)',
                        transition: 'var(--transition)'
                    }}>
                        <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '1.3rem' }}>☕ Premium Quality</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Access to the finest unroasted coffee beans from renowned coffee-growing regions worldwide.</p>
                    </div>
                    <div className="hover-lift" style={{
                        background: 'var(--background-color)',
                        padding: '2rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)',
                        transition: 'var(--transition)'
                    }}>
                        <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '1.3rem' }}>🌍 Sustainable</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Support sustainable farming practices and environmentally conscious coffee production.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
