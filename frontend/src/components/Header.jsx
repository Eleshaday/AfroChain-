import React, { useState, useEffect } from 'react';

export default function Header({ currentPage, setCurrentPage, cartCount, cartNotification, onLogout, onLogin, user }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleConnectWallet = () => {
        setCurrentPage('login');
    };

    const handleLogout = () => {
        onLogout();
        localStorage.removeItem('authToken');
    };

    const navigateTo = (page) => {
        setCurrentPage(page);
        setIsMobileMenuOpen(false);
    };

    return (
        <header id="header" className={`header ${isScrolled ? 'scrolled' : ''} ${currentPage !== 'home' ? 'not-home' : ''}`}>
            <div className="container header-container">
                <div className="brand-logo">
                    <a href="#" className="logo-text" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
                        <i className="fas fa-seedling logo-icon"></i>
                        FarmerChain
                    </a>
                </div>
                
                <ul className="nav-links">
                    <li>
                    <a 
                        href="#" 
                            className={currentPage === 'home' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                    >
                            <i className="fas fa-home"></i> Home
                    </a>
                    </li>
                    <li>
                    <a 
                        href="#" 
                            className={currentPage === 'products' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); navigateTo('products'); }}
                    >
                            <i className="fas fa-shopping-bag"></i> Products
                    </a>
                    </li>
                    <li>
                    <a 
                        href="#" 
                            className={currentPage === 'escrow' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); navigateTo('escrow'); }}
                        >
                            <i className="fas fa-handshake"></i> Escrow
                        </a>
                    </li>
                    <li>
                    <a 
                        href="#" 
                            className={currentPage === 'loyalty' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); navigateTo('loyalty'); }}
                        >
                            <i className="fas fa-coins"></i> Loyalty
                        </a>
                    </li>
                </ul>
                
                <div className="nav-buttons">
                    {user ? (
                        <>
                            <button className="cart-btn" onClick={() => navigateTo('cart')} title="View Cart">
                                <i className="fas fa-shopping-cart"></i>
                                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                            </button>
                            <div className="user-menu">
                                <div className="user-avatar">
                                    <i className="fas fa-user-circle"></i>
                                </div>
                                <div className="user-dropdown">
                                    <div className="user-info">
                                        <span className="user-name">{user.name || 'Farmer'}</span>
                                        <span className="user-wallet">{user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}</span>
                                    </div>
                                    <div className="user-actions">
                                        <button className="dropdown-item" onClick={() => navigateTo('cart')}>
                                            <i className="fas fa-shopping-cart"></i> My Cart
                                        </button>
                                        <button className="dropdown-item" onClick={() => navigateTo('transactions')}>
                                            <i className="fas fa-receipt"></i> My Orders
                                        </button>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            <i className="fas fa-sign-out-alt"></i> Disconnect
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={handleConnectWallet}>
                            <i className="fas fa-wallet"></i> Connect Wallet
                        </button>
                    )}
                </div>
                
                <div className="mobile-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu-overlay">
                    <div className="mobile-nav-links">
                        <a href="#" className={currentPage === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
                            <i className="fas fa-home"></i> Home
                        </a>
                        <a href="#" className={currentPage === 'products' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('products'); }}>
                            <i className="fas fa-shopping-bag"></i> Products
                        </a>
                        <a href="#" className={currentPage === 'cart' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('cart'); }}>
                            <i className="fas fa-shopping-cart"></i> Cart {cartCount > 0 && `(${cartCount})`}
                        </a>
                        <a href="#" className={currentPage === 'escrow' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('escrow'); }}>
                            <i className="fas fa-handshake"></i> Escrow
                        </a>
                        <a href="#" className={currentPage === 'loyalty' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('loyalty'); }}>
                            <i className="fas fa-coins"></i> Loyalty
                        </a>
                        {user && (
                            <a href="#" className={currentPage === 'transactions' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('transactions'); }}>
                                <i className="fas fa-receipt"></i> My Orders
                            </a>
                        )}
                    </div>
                    <div className="mobile-nav-buttons">
                        {user ? (
                            <button className="btn btn-outline" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"></i> Disconnect Wallet
                            </button>
                        ) : (
                            <button className="btn btn-primary" onClick={handleConnectWallet}>
                                <i className="fas fa-wallet"></i> Connect Wallet
                            </button>
                    )}
                </div>
            </div>
            )}
        </header>
    );
}