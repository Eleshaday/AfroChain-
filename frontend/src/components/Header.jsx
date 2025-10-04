import React from 'react';

export default function Header({ currentPage, setCurrentPage, cartCount, cartNotification }) {
    return (
        <header className="header">
            <div className="header-content">
                <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>
                    ☕ CoffeeDirect
                </a>
                <nav className="nav">
                    <a 
                        href="#" 
                        className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
                    >
                        Home
                    </a>
                    <a 
                        href="#" 
                        className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setCurrentPage('products'); }}
                    >
                        Products
                    </a>
                    <a 
                        href="#" 
                        className={`nav-link ${currentPage === 'farmer-post' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setCurrentPage('farmer-post'); }}
                    >
                        Sell Coffee
                    </a>
                    <a 
                        href="#" 
                        className={`nav-link cart-link ${currentPage === 'cart' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setCurrentPage('cart'); }}
                        style={{ position: 'relative' }}
                    >
                        🛒 Cart
                        {cartCount > 0 && (
                            <span className="cart-badge">
                                {cartCount}
                            </span>
                        )}
                        {cartNotification > 0 && (
                            <span className="cart-notification">
                                {cartNotification}
                            </span>
                        )}
                    </a>
                </nav>
            </div>
        </header>
    );
}
