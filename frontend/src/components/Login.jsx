import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showResetSuccess, setShowResetSuccess] = useState(false);
    const [showSignupSuccess, setShowSignupSuccess] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const showAlertMessage = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
    };

    const closeAlert = () => {
        setShowAlert(false);
    };

    const toggleAuth = (login) => {
        setIsLogin(login);
        setShowSignupSuccess(false);
    };

    const openForgotPassword = () => {
        setShowForgotPassword(true);
    };

    const closeForgotPassword = () => {
        setShowForgotPassword(false);
    };

    const closeResetSuccess = () => {
        setShowResetSuccess(false);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const email = e.target['login-email'].value;
        const password = e.target['login-password'].value;
        
        try {
            const response = await apiService.login(email, password);
            login(response.user);
            showAlertMessage('Login successful! Welcome back!', 'success');
            
            // Redirect to home after a short delay
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            showAlertMessage(error.message || 'Login failed. Please try again.', 'error');
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        const name = e.target['signup-name'].value;
        const email = e.target['signup-email'].value;
        const password = e.target['signup-password'].value;
        const confirmPassword = e.target['signup-confirm'].value;
        
        if (password !== confirmPassword) {
            showAlertMessage('Passwords do not match!', 'error');
            return;
        }
        
        try {
            const response = await apiService.register(name, email, password);
            login(response.user);
            showAlertMessage('Account created successfully! Welcome to Chakka Coffee!', 'success');
            
            // Redirect to home after a short delay
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            showAlertMessage(error.message || 'Registration failed. Please try again.', 'error');
        }
    };

    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();
        const email = e.target['reset-email'].value;
        
        // In a real application, you would send a reset email here
        setShowForgotPassword(false);
        
        // Show confirmation message
        showAlertMessage(`Password reset link has been sent to ${email}. Please check your inbox.`, 'success');
    };

    // Close modals when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.classList.contains('modal')) {
                setShowForgotPassword(false);
                setShowResetSuccess(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="login-page">
            {/* Custom Alert */}
            {showAlert && (
                <div className={`custom-alert ${alertType}`}>
                    <div className="custom-alert-content">
                        <i className={`fas ${alertType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} custom-alert-icon`}></i>
                        <div className="custom-alert-message">{alertMessage}</div>
                        <button className="custom-alert-close" onClick={closeAlert}>&times;</button>
                    </div>
                </div>
            )}
            
            {/* Auth Container */}
            <div className="auth-container">
                <div className="brand-logo">
                    <Link to="/" className="logo-text">
                        <i className="fas fa-coffee logo-icon"></i>
                        Chakka Coffee
                    </Link>
                </div>
                
                {/* Login Form */}
                {isLogin && !showSignupSuccess && (
                    <div>
                        <div className="auth-header">
                            <h2>Welcome Back</h2>
                            <p>Sign in to your account to continue your coffee journey</p>
                        </div>
                        
                        <div className="auth-tabs">
                            <div className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => toggleAuth(true)}>Login</div>
                            <div className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => toggleAuth(false)}>Sign Up</div>
                        </div>
                        
                        <form onSubmit={handleLoginSubmit}>
                            <div className="form-group">
                                <label htmlFor="login-email" className="form-label">Email Address</label>
                                <input type="email" id="login-email" name="login-email" className="form-input" placeholder="your@email.com" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="login-password" className="form-label">Password</label>
                                <input type="password" id="login-password" name="login-password" className="form-input" placeholder="Enter your password" required />
                            </div>
                            
                            <div className="form-options">
                                <div className="remember-me">
                                    <input type="checkbox" id="remember-me" name="remember-me" />
                                    <label htmlFor="remember-me">Remember me</label>
                                </div>
                                <a className="forgot-password" onClick={openForgotPassword}>Forgot password?</a>
                            </div>
                            
                            <button type="submit" className="btn btn-primary btn-large">Sign In</button>
                        </form>
                        
                        <div className="divider">
                            <span>Or continue with</span>
                        </div>
                        
                        <div className="social-login">
                            <button type="button" className="social-btn google-btn">
                                <i className="fab fa-google"></i> Google
                            </button>
                            <button type="button" className="social-btn facebook-btn">
                                <i className="fab fa-facebook-f"></i> Facebook
                            </button>
                        </div>
                        
                        <div className="auth-footer">
                            <p>Don't have an account? <a href="#" onClick={() => toggleAuth(false)}>Sign up here</a></p>
                            <p style={{marginTop: '1rem'}}><Link to="/">← Back to Home</Link></p>
                        </div>
                    </div>
                )}
                
                {/* Sign Up Form */}
                {!isLogin && !showSignupSuccess && (
                    <div>
                        <div className="auth-header">
                            <h2>Join Chakka Coffee</h2>
                            <p>Create an account to explore Ethiopian coffee excellence</p>
                        </div>
                        
                        <div className="auth-tabs">
                            <div className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => toggleAuth(true)}>Login</div>
                            <div className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => toggleAuth(false)}>Sign Up</div>
                        </div>
                        
                        <form onSubmit={handleSignupSubmit}>
                            <div className="form-group">
                                <label htmlFor="signup-name" className="form-label">Full Name</label>
                                <input type="text" id="signup-name" name="signup-name" className="form-input" placeholder="Your full name" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="signup-email" className="form-label">Email Address</label>
                                <input type="email" id="signup-email" name="signup-email" className="form-input" placeholder="your@email.com" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="signup-password" className="form-label">Password</label>
                                <input type="password" id="signup-password" name="signup-password" className="form-input" placeholder="Create a password" required />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="signup-confirm" className="form-label">Confirm Password</label>
                                <input type="password" id="signup-confirm" name="signup-confirm" className="form-input" placeholder="Confirm your password" required />
                            </div>
                            
                            <div className="form-group">
                                <input type="checkbox" id="terms" name="terms" required />
                                <label htmlFor="terms">I agree to the <a href="#" style={{color: 'var(--primary)'}}>Terms of Service</a> and <a href="#" style={{color: 'var(--primary)'}}>Privacy Policy</a></label>
                            </div>
                            
                            <button type="submit" className="btn btn-primary btn-large">Create Account</button>
                        </form>
                        
                        <div className="divider">
                            <span>Or continue with</span>
                        </div>
                        
                        <div className="social-login">
                            <button type="button" className="social-btn google-btn">
                                <i className="fab fa-google"></i> Google
                            </button>
                            <button type="button" className="social-btn facebook-btn">
                                <i className="fab fa-facebook-f"></i> Facebook
                            </button>
                        </div>
                        
                        <div className="auth-footer">
                            <p>Already have an account? <a href="#" onClick={() => toggleAuth(true)}>Sign in here</a></p>
                            <p style={{marginTop: '1rem'}}><Link to="/">← Back to Home</Link></p>
                        </div>
                    </div>
                )}
                
                {/* Success Message */}
                {showSignupSuccess && (
                    <div className="form-success">
                        <i className="fas fa-check-circle"></i>
                        <h3>Account Created Successfully!</h3>
                        <p>Your account has been created. You can now sign in to explore our Ethiopian coffee collection.</p>
                        <a href="#" className="btn btn-primary" onClick={() => toggleAuth(true)}>Sign In Now</a>
                    </div>
                )}
            </div>
            
            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeForgotPassword}>&times;</button>
                        <div className="modal-header">
                            <h3>Reset Your Password</h3>
                            <p>Enter your email address and we'll send you a link to reset your password.</p>
                        </div>
                        <form onSubmit={handleForgotPasswordSubmit}>
                            <div className="form-group">
                                <label htmlFor="reset-email" className="form-label">Email Address</label>
                                <input type="email" id="reset-email" name="reset-email" className="form-input" placeholder="your@email.com" required />
                            </div>
                            <button type="submit" className="btn btn-primary btn-large">Send Reset Link</button>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Reset Success Modal */}
            {showResetSuccess && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeResetSuccess}>&times;</button>
                        <div className="form-success">
                            <i className="fas fa-check-circle"></i>
                            <h3>Reset Link Sent!</h3>
                            <p>We've sent a password reset link to your email address. Please check your inbox.</p>
                            <a href="#" className="btn btn-primary" onClick={closeResetSuccess}>Okay</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
