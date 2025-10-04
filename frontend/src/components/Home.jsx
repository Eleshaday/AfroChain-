import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Home.css';

const Home = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { itemCount, addToCart } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAddToCart = async (coffeeType, price) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await addToCart(coffeeType, 1, price);
            alert(`${coffeeType} added to cart!`);
        } catch (error) {
            alert('Error adding to cart: ' + error.message);
        }
    };

    useEffect(() => {
        // Header scroll effect for blending
        const handleScroll = () => {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        // Mobile menu toggle with improved functionality
        const handleMobileMenu = () => {
            const navLinks = document.querySelector('.nav-links');
            const navButtons = document.querySelector('.nav-buttons');
            
            navLinks.classList.toggle('active');
            navButtons.classList.toggle('active');
        };

        // Close mobile menu when clicking outside
        const handleClickOutside = (event) => {
            const navLinks = document.querySelector('.nav-links');
            const navButtons = document.querySelector('.nav-buttons');
            const headerContainer = document.querySelector('.header-container');
            
            if (!event.target.closest('.header-container') && !event.target.closest('.nav-links') && !event.target.closest('.nav-buttons')) {
                navLinks.classList.remove('active');
                navButtons.classList.remove('active');
            }
        };

        // Simple animation on scroll for roast cards
        const setupScrollAnimations = () => {
            const roastCards = document.querySelectorAll('.roast-card');
            const benefitCards = document.querySelectorAll('.benefit-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            roastCards.forEach(card => {
                card.style.opacity = 0;
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(card);
            });
            
            benefitCards.forEach(card => {
                card.style.opacity = 0;
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(card);
            });
        };

        // Set up event listeners
        window.addEventListener('scroll', handleScroll);
        const mobileMenuBtn = document.querySelector('.mobile-menu');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', handleMobileMenu);
        }
        document.addEventListener('click', handleClickOutside);
        setupScrollAnimations();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (mobileMenuBtn) {
                mobileMenuBtn.removeEventListener('click', handleMobileMenu);
            }
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            {/* Header */}
            <header id="header">
                <div className="container header-container">
                    <div className="brand-logo">
                        <a href="#" className="logo-text">
                            <i className="fas fa-coffee logo-icon"></i>
                            Chakka Coffee
                        </a>
                    </div>
                    
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                    
                    <div className="nav-buttons">
                        {isAuthenticated ? (
                            <>
                                <div className="user-menu">
                                    <div className="user-avatar">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <div className="user-dropdown">
                                        <div className="user-info">
                                            <span className="user-name">{user?.name || 'User'}</span>
                                            <span className="user-email">{user?.email}</span>
                                        </div>
                                        <div className="user-actions">
                                            <button className="dropdown-item">
                                                <i className="fas fa-user"></i> Profile
                                            </button>
                                            <button className="dropdown-item">
                                                <i className="fas fa-shopping-cart"></i> Cart
                                            </button>
                                            <button className="dropdown-item" onClick={handleLogout}>
                                                <i className="fas fa-sign-out-alt"></i> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button className="cart-btn">
                                    <i className="fas fa-shopping-cart"></i>
                                    <span className="cart-count">{itemCount}</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline">Login</Link>
                                <Link to="/login" className="btn btn-primary">Sign Up</Link>
                            </>
                        )}
                    </div>
                    
                    <div className="mobile-menu">
                        <i className="fas fa-bars"></i>
                    </div>
                </div>
            </header>
            
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1>Ethiopian Coffee Excellence</h1>
                    <p>Experience the birthplace of coffee with beans sourced directly from Ethiopian farmers. Taste the authentic flavors that started it all.</p>
                    <a href="#" className="btn btn-outline btn-large" style={{width: 'auto', display: 'inline-block'}}>EXPLORE ROASTS</a>
                </div>
            </section>
            
            {/* Promo Section */}
            <section className="promo">
                <div className="container promo-content">
                    <h2>15% Off Your First Order</h2>
                    <p>Discover the taste of authentic Ethiopian coffee with our introductory offer</p>
                    <a href="#" className="btn btn-secondary">SHOP NOW</a>
                </div>
            </section>
            
            {/* Roasts Section */}
            <section className="roasts-section">
                <div className="container">
                    <div className="roasts-header">
                        <h2>Our Coffee Is<br /><span>Ethiopian Excellence</span></h2>
                        <p>Discover the unique flavors from the birthplace of coffee</p>
                    </div>
                    
                    <div className="roasts-grid">
                        <div className="roast-card light-roast">
                            <div className="roast-img">
                                <img src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Light Roast Coffee" />
                                <div className="roast-overlay">
                                    <h3 className="roast-title">The Light Roast</h3>
                                </div>
                            </div>
                            <div className="roast-info">
                                <div className="roast-region">
                                    <i className="fas fa-mountain"></i>
                                    <span>Yirgacheffe Region</span>
                                </div>
                                <p className="roast-description">
                                    Grown in the highlands of Yirgacheffe, this light roast preserves the delicate floral and citrus notes that make Ethiopian coffee world-famous. With bright acidity and a tea-like body, it's perfect for those who appreciate nuanced flavors.
                                </p>
                                <div className="roast-details">
                                    <div className="detail">
                                        <div className="detail-value">1,900m</div>
                                        <div className="detail-label">Altitude</div>
                                    </div>
                                    <div className="detail">
                                        <div className="detail-value">Floral</div>
                                        <div className="detail-label">Profile</div>
                                    </div>
                                    <div className="detail">
                                        <div className="detail-value">Light</div>
                                        <div className="detail-label">Body</div>
                                    </div>
                                </div>
                                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                    <a href="#" className="btn btn-primary">Explore Yirgacheffe</a>
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={() => handleAddToCart('Yirgacheffe Light Roast', 24.99)}
                                    >
                                        Add to Cart - $24.99
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="roast-card middle-roast">
                            <div className="roast-img">
                                <img src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Middle Roast Coffee" />
                                <div className="roast-overlay">
                                    <h3 className="roast-title">The Middle Roast</h3>
                                </div>
                            </div>
                            <div className="roast-info">
                                <div className="roast-region">
                                    <i className="fas fa-seedling"></i>
                                    <span>Sidamo Region</span>
                                </div>
                                <p className="roast-description">
                                    Hailing from the fertile soils of Sidamo, this medium roast balances bright acidity with rich body. Expect notes of dark chocolate, berries, and a hint of spice. A versatile coffee that pleases both light and dark roast enthusiasts.
                                </p>
                                <div className="roast-details">
                                    <div className="detail">
                                        <div className="detail-value">1,750m</div>
                                        <div className="detail-label">Altitude</div>
                                    </div>
                                    <div className="detail">
                                        <div className="detail-value">Balanced</div>
                                        <div className="detail-label">Profile</div>
                                    </div>
                                    <div className="detail">
                                        <div className="detail-value">Medium</div>
                                        <div className="detail-label">Body</div>
                                    </div>
                                </div>
                                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                    <a href="#" className="btn btn-primary">Explore Sidamo</a>
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={() => handleAddToCart('Sidamo Medium Roast', 19.99)}
                                    >
                                        Add to Cart - $19.99
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="roast-card dark-roast">
                            <div className="roast-img">
                                <img src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Dark Roast Coffee" />
                                <div className="roast-overlay">
                                    <h3 className="roast-title">The Dark Roast</h3>
                                </div>
                            </div>
                            <div className="roast-info">
                                <div className="roast-region">
                                    <i className="fas fa-fire"></i>
                                    <span>Harrar Region</span>
                                </div>
                                <p className="roast-description">
                                    From the ancient coffee forests of Harrar comes this bold dark roast with intense flavors of dark chocolate, spice, and a distinctive wine-like finish. This traditional dry-processed coffee offers a full body and complex aroma.
                                </p>
                                <div className="roast-details">
                                    <div className="detail">
                                        <div className="detail-value">1,600m</div>
                                        <div className="detail-label">Altitude</div>
                                    </div>
                                    <div className="detail">
                                        <div className="detail-value">Bold</div>
                                        <div className="detail-label">Profile</div>
                                    </div>
                                    <div className="detail">
                                        <div className="detail-value">Full</div>
                                        <div className="detail-label">Body</div>
                                    </div>
                                </div>
                                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                    <a href="#" className="btn btn-primary">Explore Harrar</a>
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={() => handleAddToCart('Harrar Dark Roast', 29.99)}
                                    >
                                        Add to Cart - $29.99
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Benefits Section */}
            <section className="benefits">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose Chakka Coffee?</h2>
                        <p>We're committed to ethical sourcing and exceptional quality</p>
                    </div>
                    
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-leaf"></i>
                            </div>
                            <h3>Sustainable Farming</h3>
                            <p>We partner with farmers who use environmentally responsible practices that protect Ethiopia's unique ecosystems.</p>
                        </div>
                        
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-hand-holding-usd"></i>
                            </div>
                            <h3>Fair Prices</h3>
                            <p>Farmers receive fair compensation for their harvest, supporting thriving rural communities in Ethiopia.</p>
                        </div>
                        
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-shipping-fast"></i>
                            </div>
                            <h3>Freshly Roasted</h3>
                            <p>We roast beans weekly in small batches to ensure peak flavor in every bag, shipped directly to you.</p>
                        </div>
                        
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <i className="fas fa-seedling"></i>
                            </div>
                            <h3>Direct Relationships</h3>
                            <p>We build long-term partnerships with farmers, visiting Ethiopian farms regularly to ensure quality.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer>
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <h3>Chakka Coffee</h3>
                            <p>Connecting coffee lovers with sustainable farmers in Ethiopia. Taste the authentic flavors from the birthplace of coffee.</p>
                            <div className="social-links">
                                <a href="#"><i className="fab fa-facebook-f"></i></a>
                                <a href="#"><i className="fab fa-instagram"></i></a>
                                <a href="#"><i className="fab fa-pinterest"></i></a>
                                <a href="#"><i className="fab fa-tiktok"></i></a>
                            </div>
                        </div>
                        
                        <div className="footer-col">
                            <h3>Shop</h3>
                            <ul className="footer-links">
                                <li><Link to="/products">All Coffees</Link></li>
                                <li><Link to="/products">Single Origin</Link></li>
                                <li><Link to="/products">Blends</Link></li>
                                <li><Link to="/products">Coffee Gear</Link></li>
                                <li><Link to="/products">Gift Cards</Link></li>
                            </ul>
                        </div>
                        
                        <div className="footer-col">
                            <h3>Help</h3>
                            <ul className="footer-links">
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><Link to="/contact">Shipping & Returns</Link></li>
                                <li><Link to="/contact">Brewing Guides</Link></li>
                                <li><Link to="/contact">FAQ</Link></li>
                                <li><Link to="/contact">Track Order</Link></li>
                            </ul>
                        </div>
                        
                        <div className="footer-col">
                            <h3>Contact</h3>
                            <ul className="footer-links">
                                <li><i className="fas fa-map-marker-alt"></i> Addis Ababa, Ethiopia</li>
                                <li><i className="fas fa-phone"></i> +251 911 234 567</li>
                                <li><i className="fas fa-envelope"></i> hello@chakkacoffee.com</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="copyright">
                        <p>&copy; 2023 Chakka Coffee. All rights reserved. Proudly supporting Ethiopian coffee farmers.</p>
                    </div>
                </div>
            </footer>
            
        </div>
    );
};

export default Home;
