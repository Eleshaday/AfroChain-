import React from 'react';

export default function Header({ currentPage, setCurrentPage, cartCount, cartNotification, onLogout, onLogin }) {
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
                        className={`nav-link ${currentPage === 'transactions' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setCurrentPage('transactions'); }}
                    >
                        📋 Transactions
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
                
                {/* Logout/Login Simulation */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                        onClick={onLogout}
                        style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        🚪 Logout
                    </button>
                    <button 
                        onClick={onLogin}
                        style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        🔑 Login
                    </button>
                </div>
            </div>
        </header>
    );
}
