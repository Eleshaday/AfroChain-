import React, { useState, useEffect } from 'react';
import ProductCategories from './ProductCategories';

export default function ProductsPage({ products, onAddToCart, onVerifyProduct }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);

    useEffect(() => {
        let filtered = products;
        
        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product => 
                (product.productName || product.coffeeName || '').toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.origin.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
        }
        
        setFilteredProducts(filtered);
    }, [products, selectedCategory, searchQuery]);

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
    }, [filteredProducts]);

    return (
        <div className="products-page">
            {/* Header */}
            <header className="products-header">
                <div className="container">
                    <div className="header-content">
                        <h1 className="page-title">
                            <i className="fas fa-seedling"></i>
                            Agricultural Products
            </h1>
                        <p className="page-subtitle">
                            Discover fresh products directly from farmers worldwide
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="products-main">
                <div className="container">
                    {/* Search and Filters */}
                    <div className="search-filters">
                        <div className="search-bar">
                            <i className="fas fa-search"></i>
                        <input
                            type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                        />
                    </div>
                    </div>
                    
                    {/* Product Categories */}
                    <ProductCategories
                        onCategorySelect={handleCategorySelect}
                        selectedCategory={selectedCategory}
                    />

                    {/* Results Summary */}
                    <div className="results-summary">
                        <h2>
                            {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
                            {searchQuery && ` matching "${searchQuery}"`}
                        </h2>
                        <p>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</p>
            </div>

            {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
            <div className="products-grid">
                            {filteredProducts.map((product, index) => (
                        <div 
                            key={product.id} 
                            className="product-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
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
                                
                                        <div className="product-details">
                                            <div className="detail-item">
                                                <span className="detail-label">Price:</span>
                                                <span className="detail-value">{product.price}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Available:</span>
                                                <span className="detail-value">{product.available} units</span>
                                            </div>
                                            {product.harvestDate && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Harvest:</span>
                                                    <span className="detail-value">{new Date(product.harvestDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                </div>
                                
                                        <div className="product-actions">
                                    <button 
                                        onClick={() => onAddToCart(product)}
                                        className="add-to-cart-btn"
                                    >
                                                <i className="fas fa-shopping-cart"></i>
                                                Add to Cart
                                    </button>
                                        <button 
                                                onClick={() => onVerifyProduct(product.batchId)}
                                                className="verify-btn"
                                            >
                                                <i className="fas fa-shield-alt"></i>
                                                Verify
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">
                            <div className="no-products-icon">
                                <i className="fas fa-search"></i>
                            </div>
                            <h3>No products found</h3>
                            <p>
                                {searchQuery 
                                    ? `No products match "${searchQuery}". Try a different search term.`
                                    : 'No products available in this category.'
                                }
                            </p>
                            <button 
                                className="btn btn-primary"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('');
                                }}
                            >
                                Clear Filters
                            </button>
                    </div>
                )}
            </div>
            </main>
        </div>
    );
}