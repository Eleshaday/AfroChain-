import React from 'react';

export default function HomePage({ products, onAddToCart }) {
    const featuredProducts = products.slice(0, 3); // Show first 3 products as featured

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Farm-to-Cup Coffee Marketplace</h1>
                    <p>Connect directly with coffee farmers and discover premium unroasted beans from around the world</p>
                    <button className="cta-button">Explore Coffee</button>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-section">
                <h2 className="section-title">Featured Coffee Beans</h2>
                <div className="products-grid">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <img 
                                src={product.image} 
                                alt={product.coffeeName}
                                className="product-image"
                            />
                            <div className="product-info">
                                <div className="farmer-name">{product.farmerName}</div>
                                <h3 className="coffee-name">{product.coffeeName}</h3>
                                <div className="origin">📍 {product.origin}</div>
                                <span className="roast-level">{product.roastLevel}</span>
                                {product.qualityLevel && (
                                    <span className={`quality-badge quality-grade-${product.qualityLevel.includes('Grade 1') ? '1' : product.qualityLevel.includes('Grade 2') ? '2' : '3'}`}>
                                        {product.qualityLevel}
                                    </span>
                                )}
                                {product.certification && (
                                    <span className="certification-badge">{product.certification}</span>
                                )}
                                <p className="description">{product.description}</p>
                                <div className="price">{product.price}</div>
                                <div className="available">Available: {product.available} lbs</div>
                                <button className="buy-button" onClick={() => onAddToCart(product)}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section style={{ 
                background: 'white', 
                padding: '4rem 2rem', 
                textAlign: 'center',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#2c1810' }}>
                    Why Choose CoffeeDirect?
                </h2>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '2rem',
                    marginTop: '2rem'
                }}>
                    <div>
                        <h3 style={{ color: '#8B4513', marginBottom: '1rem' }}>🌱 Direct from Farmers</h3>
                        <p>Buy coffee beans directly from farmers, ensuring fair prices and supporting local communities.</p>
                    </div>
                    <div>
                        <h3 style={{ color: '#8B4513', marginBottom: '1rem' }}>☕ Premium Quality</h3>
                        <p>Access to the finest unroasted coffee beans from renowned coffee-growing regions worldwide.</p>
                    </div>
                    <div>
                        <h3 style={{ color: '#8B4513', marginBottom: '1rem' }}>🌍 Sustainable</h3>
                        <p>Support sustainable farming practices and environmentally conscious coffee production.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
