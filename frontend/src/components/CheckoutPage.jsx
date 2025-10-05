import React, { useState } from 'react';
import TokenPayment from './TokenPayment';

export default function CheckoutPage({ cart, totalPrice, onBackToCart, onPaymentSuccess }) {
    const [paymentInterface, setPaymentInterface] = useState('enhanced'); // 'enhanced' or 'legacy'
    const [paymentMethod, setPaymentMethod] = useState('blockchain');
    const [walletAddress, setWalletAddress] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [network, setNetwork] = useState('ethereum');
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionHash, setTransactionHash] = useState('');

    const handlePayment = async () => {
        if (!walletAddress) {
            alert('Please enter your wallet address');
            return;
        }

        if (network === 'ethereum' && !privateKey) {
            alert('Please enter your private key for Ethereum transactions');
            return;
        }

        setIsProcessing(true);
        
        try {
            console.log('Sending payment request to:', 'http://localhost:4000/api/process-payment');
            console.log('Payment data:', {
                walletAddress,
                privateKey: network === 'ethereum' ? privateKey : undefined,
                amount: totalPrice,
                network,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.coffeeName,
                    quantity: item.quantity,
                    price: parseFloat(item.price.replace('$', ''))
                }))
            });

            const response = await fetch('http://localhost:4000/api/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    walletAddress,
                    privateKey: network === 'ethereum' ? privateKey : undefined,
                    amount: totalPrice,
                    network,
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.coffeeName,
                        quantity: item.quantity,
                        price: parseFloat(item.price.replace('$', ''))
                    }))
                })
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Payment result:', result);
            
            if (result.success) {
                setTransactionHash(result.transactionHash);
                
                // Store transaction in localStorage for history
                const transaction = {
                    id: Date.now(),
                    hash: result.transactionHash,
                    amount: totalPrice,
                    network: result.network,
                    items: cart.map(item => ({
                        name: item.coffeeName,
                        quantity: item.quantity,
                        price: parseFloat(item.price.replace('$', ''))
                    })),
                    timestamp: new Date().toISOString(),
                    status: 'completed'
                };
                
                // Save to transaction history
                const existingTransactions = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
                existingTransactions.unshift(transaction);
                localStorage.setItem('transactionHistory', JSON.stringify(existingTransactions));
                
                alert(`Payment processed successfully! Transaction Hash: ${result.transactionHash}\n\nRedirecting to transaction history...`);
                
                // Quick redirect to transaction history after successful payment
                setTimeout(() => {
                    onPaymentSuccess();
                }, 500);
            } else {
                alert('Payment failed: ' + result.error);
            }
        } catch (error) {
            alert('Payment failed: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="checkout-page">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <h1 className="section-title">
                    Checkout
                </h1>
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    background: 'var(--background-color)',
                    padding: '0.5rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-color)'
                }}>
                    <button
                        onClick={() => setPaymentInterface('enhanced')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: 'var(--border-radius)',
                            background: paymentInterface === 'enhanced' ? 'var(--primary-color)' : 'transparent',
                            color: paymentInterface === 'enhanced' ? 'white' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'var(--transition)'
                        }}
                    >
                        🚀 Enhanced
                    </button>
                    <button
                        onClick={() => setPaymentInterface('legacy')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: 'var(--border-radius)',
                            background: paymentInterface === 'legacy' ? 'var(--primary-color)' : 'transparent',
                            color: paymentInterface === 'legacy' ? 'white' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'var(--transition)'
                        }}
                    >
                        🔗 Legacy
                    </button>
                </div>
            </div>

            {paymentInterface === 'enhanced' ? (
                <TokenPayment
                    cart={cart}
                    totalPrice={totalPrice}
                    onPaymentSuccess={onPaymentSuccess}
                    onBack={onBackToCart}
                />
            ) : (
                <div>
                    {/* Legacy Payment Interface */}

            {/* Order Summary */}
            <div className="cart-total">
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    Order Summary
                </h2>
                
                {cart.map(item => (
                    <div key={item.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #eee'
                    }}>
                        <span>{item.coffeeName} x {item.quantity}</span>
                        <span>${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    marginTop: '1rem',
                    color: '#2c1810'
                }}>
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-form">
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Payment Method
                </h2>
                
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="blockchain"
                            checked={paymentMethod === 'blockchain'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <span>🔗 Blockchain Payment</span>
                    </label>
                </div>

                {/* Network Selection */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Blockchain Network:
                    </label>
                    <select
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            marginBottom: '1rem'
                        }}
                    >
                        <option value="ethereum">Ethereum (ETH)</option>
                        <option value="hedera">Hedera (HBAR)</option>
                    </select>
                </div>

                {paymentMethod === 'blockchain' && (
                    <div>
                        <div className="form-group">
                            <label className="form-label">
                                Wallet Address:
                            </label>
                            <input
                                type="text"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                placeholder={network === 'ethereum' ? "Enter your Ethereum address (0x...)" : "Enter your Hedera account ID (0.0.123456)"}
                                className="form-input"
                            />
                        </div>
                        
                        {network === 'ethereum' && (
                            <div className="form-group">
                                <label className="form-label">
                                    Private Key (for transaction signing):
                                </label>
                                <input
                                    type="password"
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    placeholder="Enter your private key (0x...)"
                                    className="form-input"
                                />
                                <p style={{ color: 'var(--error-color)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                                    ⚠️ Never share your private key! This is for demonstration only.
                                </p>
                            </div>
                        )}
                        
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Your payment will be processed using {network === 'ethereum' ? 'Ethereum' : 'Hedera'} blockchain for secure, transparent transactions.
                        </p>
                    </div>
                )}
            </div>

            {/* Transaction Status */}
            {transactionHash && (
                <div style={{
                    background: '#d4edda',
                    color: '#155724',
                    padding: '1rem',
                    borderRadius: '5px',
                    marginBottom: '2rem',
                    border: '1px solid #c3e6cb'
                }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>✅ Payment Successful!</h3>
                    <p>Transaction Hash: <code>{transactionHash}</code></p>
                    <p>Your order has been confirmed and will be processed.</p>
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    onClick={onBackToCart}
                    style={{
                        background: '#6c757d',
                        color: 'white',
                        padding: '1rem 2rem',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1.1rem',
                        cursor: 'pointer'
                    }}
                >
                    Back to Cart
                </button>
                
                <button
                    onClick={handlePayment}
                    disabled={isProcessing || !walletAddress}
                    className="payment-btn"
                >
                    {isProcessing ? '⏳ Processing...' : '💳 Pay with Blockchain'}
                </button>
            </div>

            {/* Blockchain Info */}
            <div style={{
                background: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '10px',
                marginTop: '2rem',
                border: '1px solid #e9ecef'
            }}>
                <h3 style={{ color: '#8B4513', marginBottom: '1rem' }}>🔗 About Blockchain Payments</h3>
                <ul style={{ color: '#666', lineHeight: '1.6' }}>
                    <li>Secure and transparent transactions</li>
                    <li>No intermediaries - direct farmer-to-buyer payments</li>
                    <li>Immutable transaction records</li>
                    <li>Lower transaction fees compared to traditional payment methods</li>
                    <li>Support for multiple cryptocurrencies (ETH, HBAR, etc.)</li>
                </ul>
            </div>
            </div>
            )}
        </div>
    );
}
