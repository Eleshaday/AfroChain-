import React from 'react';

export default function Header({ currentPage, setCurrentPage, cartCount, cartNotification, onLogout, onLogin, setSelectedBatchId, setVerificationResult }) {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-section">
                    <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>
                        CoffeeDirect
                    </a>
                    <span className="tagline">Ethiopian Coffee Marketplace</span>
                </div>
                
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
                        className={`nav-link ${currentPage === 'verify' ? 'active' : ''}`}
                        onClick={(e) => { 
                            e.preventDefault(); 
                            setSelectedBatchId(null);
                            setVerificationResult(null);
                            setCurrentPage('verify'); 
                        }}
                    >
                        Verify
                    </a>
                    <a 
                        href="#" 
                        className={`nav-link ${currentPage === 'escrow' ? 'active' : ''}`}
                        onClick={(e) => { 
                            e.preventDefault(); 
                            setCurrentPage('escrow'); 
                        }}
                    >
                        Escrow
                    </a>
                    <a 
                        href="#" 
                        className={`nav-link ${currentPage === 'transactions' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setCurrentPage('transactions'); }}
                    >
                        Transactions
                    </a>
                    <a 
                        href="#" 
                        className={`nav-link cart-link ${currentPage === 'cart' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setCurrentPage('cart'); }}
                    >
                        Cart
                        {cartCount > 0 && (
                            <span className="cart-badge">
                                {cartCount}
                            </span>
                        )}
                    </a>
                </nav>
                
                <div className="auth-section">
                    <button className="auth-btn logout-btn" onClick={onLogout}>
                        Logout
                    </button>
                    <button className="auth-btn login-btn" onClick={onLogin}>
                        Login
                    </button>
                </div>
            </div>
        </header>
    );
}
