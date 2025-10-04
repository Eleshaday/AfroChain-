import React, { useState } from 'react';

export default function ProductsPage({ products, onAddToCart }) {
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
            <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '2rem', color: '#2c1810' }}>
                All Coffee Products
            </h1>
            
            {/* Filter Section */}
            <div className="filter-section">
                <h3 style={{ marginBottom: '1.5rem', color: '#2c1810' }}>Filter Products</h3>
                <div className="filter-grid">
                    <div className="filter-group">
                        <label>Search</label>
                        <input
                            type="text"
                            placeholder="Search coffee, farmer, or description..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>Origin</label>
                        <select
                            value={filters.origin}
                            onChange={(e) => handleFilterChange('origin', e.target.value)}
                        >
                            <option value="">All Origins</option>
                            {uniqueOrigins.map(origin => (
                                <option key={origin} value={origin}>{origin}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label>Price Range</label>
                        <select
                            value={filters.priceRange}
                            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        >
                            <option value="">All Prices</option>
                            <option value="0-10">Under $10</option>
                            <option value="10-15">$10 - $15</option>
                            <option value="15-20">$15 - $20</option>
                            <option value="20-999">Over $20</option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <button 
                            onClick={() => {
                                setFilters({ origin: '', priceRange: '', search: '' });
                                setFilteredProducts(products);
                            }}
                            style={{
                                background: '#8B4513',
                                color: 'white',
                                border: 'none',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '5px',
                                cursor: 'pointer',
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
                    filteredProducts.map(product => (
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
