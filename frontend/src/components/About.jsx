import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            {/* Header */}
            <header className="about-header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo-text">
                            <i className="fas fa-coffee logo-icon"></i>
                            Chakka Coffee
                        </Link>
                        <nav className="header-nav">
                            <Link to="/">Home</Link>
                            <Link to="/products">Products</Link>
                            <Link to="/about" className="active">About Us</Link>
                            <Link to="/contact">Contact</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="about-main">
                <div className="container">
                    <div className="coming-soon">
                        <div className="coming-soon-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <h1>About Us Coming Soon</h1>
                        <p>Learn about our story, mission, and the passionate team behind Chakka Coffee. Our journey from Ethiopian farms to your cup will be shared here soon!</p>
                        <div className="features">
                            <div className="feature">
                                <i className="fas fa-heart"></i>
                                <h3>Our Story</h3>
                                <p>Born from a passion for authentic Ethiopian coffee</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-handshake"></i>
                                <h3>Our Mission</h3>
                                <p>Connecting farmers with coffee lovers worldwide</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-globe"></i>
                                <h3>Our Impact</h3>
                                <p>Sustainable farming and fair trade practices</p>
                            </div>
                        </div>
                        <Link to="/" className="btn btn-primary">Back to Home</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default About;
