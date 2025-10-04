import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            {/* Header */}
            <header className="contact-header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo-text">
                            <i className="fas fa-coffee logo-icon"></i>
                            Chakka Coffee
                        </Link>
                        <nav className="header-nav">
                            <Link to="/">Home</Link>
                            <Link to="/products">Products</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact" className="active">Contact</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="contact-main">
                <div className="container">
                    <div className="coming-soon">
                        <div className="coming-soon-icon">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <h1>Contact Us Coming Soon</h1>
                        <p>Get in touch with us! Our contact form and information will be available here soon. We'd love to hear from you!</p>
                        <div className="features">
                            <div className="feature">
                                <i className="fas fa-phone"></i>
                                <h3>Phone Support</h3>
                                <p>Direct line to our customer service</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-envelope"></i>
                                <h3>Email Support</h3>
                                <p>Quick response to your inquiries</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-comments"></i>
                                <h3>Live Chat</h3>
                                <p>Real-time assistance when you need it</p>
                            </div>
                        </div>
                        <Link to="/" className="btn btn-primary">Back to Home</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;
