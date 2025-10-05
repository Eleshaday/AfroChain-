import React, { useState, useEffect } from 'react';
import QrCode from 'qrcode';
import SupplyChainTracker from './SupplyChainTracker';

export default function AuthenticityVerifier({ batchId, onVerify, verificationResult = null, coffeeProduct = null }) {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [coffeeData, setCoffeeData] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);

    // Generate QR code for the batch
    useEffect(() => {
        if (batchId) {
            generateQRCode();
        }
    }, [batchId]);

    const generateQRCode = async () => {
        try {
            const verificationUrl = `${window.location.origin}/verify/${batchId}`;
            const qrCodeDataUrl = await QrCode.toDataURL(verificationUrl, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#2C3E50',
                    light: '#FFFFFF'
                }
            });
            setQrCodeUrl(qrCodeDataUrl);
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    const handleVerification = async () => {
        setIsVerifying(true);
        try {
            await onVerify(batchId);
        } finally {
            setIsVerifying(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'AUTHENTIC': return '#28a745';
            case 'SUSPICIOUS': return '#ffc107';
            case 'FAKE': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'AUTHENTIC': return '✅';
            case 'SUSPICIOUS': return '⚠️';
            case 'FAKE': return '❌';
            default: return '❓';
        }
    };

    return (
        <div style={{
            background: 'var(--card-background)',
            padding: '2rem',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-light)',
            border: '1px solid var(--border-color)',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h2 style={{ 
                color: 'var(--primary-color)', 
                marginBottom: '1.5rem',
                textAlign: 'center'
            }}>
                🔍 Coffee Authenticity Verification
            </h2>

            {batchId && (
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                Batch ID
                            </h4>
                            <code style={{
                                background: 'var(--background-color)',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                wordBreak: 'break-all'
                            }}>
                                {batchId}
                            </code>
                        </div>
                        {qrCodeUrl && (
                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    QR Code
                                </h4>
                                <img 
                                    src={qrCodeUrl} 
                                    alt="Verification QR Code"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        border: '2px solid var(--border-color)',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleVerification}
                        disabled={isVerifying}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: isVerifying ? '#6c757d' : 'var(--gradient-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--border-radius)',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: isVerifying ? 'not-allowed' : 'pointer',
                            transition: 'var(--transition)',
                            marginBottom: '1rem'
                        }}
                    >
                        {isVerifying ? '🔍 Verifying...' : '🔍 Verify Authenticity'}
                    </button>
                </div>
            )}

            {verificationResult && (
                <div style={{
                    background: 'var(--background-color)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius)',
                    border: `2px solid ${getStatusColor(verificationResult.verification?.status)}`
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>
                            {getStatusIcon(verificationResult.verification?.status)}
                        </span>
                        <h3 style={{
                            color: getStatusColor(verificationResult.verification?.status),
                            margin: 0
                        }}>
                            {verificationResult.verification?.status || 'UNKNOWN'}
                        </h3>
                        <span style={{
                            background: getStatusColor(verificationResult.verification?.status),
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                        }}>
                            {verificationResult.verification?.confidence || 0}% Confidence
                        </span>
                    </div>

                    {verificationResult.verification?.checks && (
                        <div>
                            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                Verification Checks:
                            </h4>
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                {verificationResult.verification.checks.map((check, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.5rem',
                                        background: 'var(--card-background)',
                                        borderRadius: '4px',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        <span style={{ color: 'var(--text-primary)' }}>
                                            {check.name}
                                        </span>
                                        <span style={{
                                            color: check.status === 'VALID' || check.status === 'VERIFIED' || check.status === 'CONFIRMED' ? '#28a745' : '#dc3545',
                                            fontWeight: '600',
                                            fontSize: '0.9rem'
                                        }}>
                                            {check.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {verificationResult.valid && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'rgba(40, 167, 69, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(40, 167, 69, 0.3)'
                        }}>
                            <p style={{
                                margin: 0,
                                color: '#155724',
                                fontWeight: '500'
                            }}>
                                ✅ This coffee batch has been verified as authentic Ethiopian coffee with full blockchain traceability.
                            </p>
                        </div>
                    )}

                    {!verificationResult.valid && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'rgba(220, 53, 69, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(220, 53, 69, 0.3)'
                        }}>
                            <p style={{
                                margin: 0,
                                color: '#721c24',
                                fontWeight: '500'
                            }}>
                                ⚠️ This coffee batch could not be verified. Please contact support if you believe this is an error.
                            </p>
                        </div>
                    )}

                    <div style={{
                        marginTop: '1rem',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        textAlign: 'center'
                    }}>
                        Verified on {verificationResult.network || 'Hedera'} • {new Date().toLocaleString()}
                    </div>
                </div>
            )}

            {!batchId && (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--text-secondary)'
                }}>
                    <p>Scan a QR code or choose a product to verify authenticity.</p>
                </div>
            )}

            {/* Supply Chain Tracker */}
            {batchId && (
                <div style={{ marginTop: '2rem' }}>
                    <SupplyChainTracker 
                        batchId={batchId} 
                        coffeeProduct={coffeeProduct}
                    />
                </div>
            )}
        </div>
    );
}
