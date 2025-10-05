import React, { useState } from 'react';

export default function ProductsPage({ products, onAddToCart, onVerifyProduct }) {
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [filters, setFilters] = useState({
        origin: '',
        priceRange: '',
        search: ''
    });

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        setFilters(newFilters);
        
        let filtered = products;
        
        if (newFilters.origin) {
            filtered = filtered.filter(product => 
                product.origin.toLowerCase().includes(newFilters.origin.toLowerCase())
            );
        }
        
        if (newFilters.search) {
            filtered = filtered.filter(product => 
                product.coffeeName.toLowerCase().includes(newFilters.search.toLowerCase()) ||
                product.farmerName.toLowerCase().includes(newFilters.search.toLowerCase()) ||
                product.description.toLowerCase().includes(newFilters.search.toLowerCase())
            );
        }
        
        if (newFilters.priceRange) {
            const [min, max] = newFilters.priceRange.split('-').map(p => parseFloat(p.replace('$', '')));
            filtered = filtered.filter(product => {
                const price = parseFloat(product.price.replace('$', ''));
                return price >= min && price <= max;
            });
        }
        
        setFilteredProducts(filtered);
    };

    const uniqueOrigins = [...new Set(products.map(p => p.origin))];

    return (
        <div className="products-page">
            <h1 className="section-title">
                All Coffee Products
            </h1>
            
            {/* Filter Section */}
            <div style={{
                background: 'var(--card-background)',
                padding: '2rem',
                borderRadius: 'var(--border-radius)',
                marginBottom: '2rem',
                boxShadow: 'var(--shadow-light)',
                border: '1px solid var(--border-color)'
            }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.3rem' }}>Filter Products</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Search</label>
                        <input
                            type="text"
                            placeholder="Search coffee, farmer, or description..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Origin</label>
                        <select
                            value={filters.origin}
                            onChange={(e) => handleFilterChange('origin', e.target.value)}
                            className="form-select"
                        >
                            <option value="">All Origins</option>
                            {uniqueOrigins.map(origin => (
                                <option key={origin} value={origin}>{origin}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Price Range</label>
                        <select
                            value={filters.priceRange}
                            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                            className="form-select"
                        >
                            <option value="">All Prices</option>
                            <option value="0-10">Under $10</option>
                            <option value="10-15">$10 - $15</option>
                            <option value="15-20">$15 - $20</option>
                            <option value="20-999">Over $20</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <button 
                            onClick={() => {
                                setFilters({ origin: '', priceRange: '', search: '' });
                                setFilteredProducts(products);
                            }}
                            className="add-to-cart-btn"
                            style={{
                                background: 'var(--gradient-primary)',
                                marginTop: '1.5rem'
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <div 
                            key={product.id} 
                            className="product-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
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
                                        color: 'var(--text-secondary)',
                                        fontWeight: '600',
                                        fontSize: '0.9rem'
                                    }}>
                                        Available: {product.available} lbs
                                    </span>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                    <button 
                                        onClick={() => onAddToCart(product)}
                                        className="add-to-cart-btn"
                                        style={{ width: '100%' }}
                                    >
                                        🛒 Add to Cart
                                    </button>
                                    
                                    {product.authenticityVerified && (
                                        <button 
                                            onClick={() => onVerifyProduct && onVerifyProduct(product.batchId)}
                                            className="add-to-cart-btn"
                                            style={{
                                                background: 'linear-gradient(135deg, #17a2b8, #138496)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.75rem',
                                                borderRadius: 'var(--border-radius)',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: '600',
                                                width: '100%'
                                            }}
                                        >
                                            🔍 Verify Authenticity
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ 
                        gridColumn: '1 / -1', 
                        textAlign: 'center', 
                        padding: '2rem',
                        color: '#666'
                    }}>
                        <h3>No products found matching your filters</h3>
                        <p>Try adjusting your search criteria</p>
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div style={{ 
                textAlign: 'center', 
                marginTop: '2rem', 
                color: '#666',
                fontSize: '1.1rem'
            }}>
                Showing {filteredProducts.length} of {products.length} products
            </div>
        </div>
    );
}
