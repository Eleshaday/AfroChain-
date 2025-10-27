import React from 'react';

export default function CustomAlert({ isOpen, onClose, type = 'success', title, message, transactionHash }) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            default:
                return 'ℹ️';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success':
                return 'var(--primary)';
            case 'error':
                return '#e74c3c';
            case 'warning':
                return '#f39c12';
            default:
                return 'var(--text)';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: 'var(--border-radius)',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                textAlign: 'center',
                position: 'relative',
                animation: 'slideIn 0.3s ease-out'
            }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: 'var(--text)',
                        opacity: 0.7
                    }}
                >
                    ×
                </button>

                {/* Icon */}
                <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem'
                }}>
                    {getIcon()}
                </div>

                {/* Title */}
                <h2 style={{
                    color: getColor(),
                    marginBottom: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: '600'
                }}>
                    {title}
                </h2>

                {/* Message */}
                <p style={{
                    color: 'var(--text)',
                    marginBottom: '1.5rem',
                    lineHeight: '1.6',
                    fontSize: '1rem'
                }}>
                    {message}
                </p>

                {/* Transaction Hash */}
                {transactionHash && (
                    <div style={{
                        background: 'var(--background-color)',
                        padding: '1rem',
                        borderRadius: 'var(--border-radius)',
                        marginBottom: '1.5rem',
                        border: '1px solid var(--border-color)'
                    }}>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '0.5rem'
                        }}>
                            Transaction Hash:
                        </p>
                        <code style={{
                            background: 'white',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            color: 'var(--primary)',
                            wordBreak: 'break-all',
                            display: 'block',
                            border: '1px solid var(--border-color)'
                        }}>
                            {transactionHash}
                        </code>
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={onClose}
                    style={{
                        background: getColor(),
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem 2rem',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        width: '100%'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.opacity = '0.9';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.opacity = '1';
                    }}
                >
                    {type === 'success' ? 'Continue Shopping' : 'Close'}
                </button>
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
