import React, { useState } from 'react';

export default function Login({ onLogin, redirectTo = null, redirectState = null }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            // Simple mock auth
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
            const user = { email };
            onLogin(user, { redirectTo, redirectState });
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="products-page" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <h1 className="section-title">Login</h1>
            <form onSubmit={handleSubmit} style={{
                background: 'var(--card-background)',
                padding: '2rem',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow-light)',
                border: '1px solid var(--border-color)'
            }}>
                {error && (
                    <div style={{
                        marginBottom: '1rem',
                        color: 'var(--error-color)'
                    }}>
                        ❌ {error}
                    </div>
                )}
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="add-to-cart-btn"
                    disabled={isLoading}
                    style={{ width: '100%', marginTop: '1rem', background: 'var(--gradient-primary)' }}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}


