import React from 'react';
import { Link } from 'react-router-dom';
import './Products.css';

const Products = () => {
    return (
        <div className="products-page">
            {/* Header */}
            <header className="products-header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo-text">
                            <i className="fas fa-coffee logo-icon"></i>
                            Chakka Coffee
                        </Link>
                        <nav className="header-nav">
                            <Link to="/">Home</Link>
                            <Link to="/products" className="active">Products</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="products-main">
                <div className="container">
                    <div className="coming-soon">
                        <div className="coming-soon-icon">
                            <i className="fas fa-coffee"></i>
                        </div>
                        <h1>Products Coming Soon</h1>
                        <p>We're working hard to bring you the finest selection of Ethiopian coffee beans. Our product catalog will be available soon!</p>
                        <div className="features">
                            <div className="feature">
                                <i className="fas fa-leaf"></i>
                                <h3>Sustainable Sourcing</h3>
                                <p>Direct from Ethiopian farmers</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-shipping-fast"></i>
                                <h3>Fresh Roasting</h3>
                                <p>Weekly small-batch roasting</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-award"></i>
                                <h3>Premium Quality</h3>
                                <p>Single origin excellence</p>
                            </div>
                        </div>
                        <Link to="/" className="btn btn-primary">Back to Home</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Products;
