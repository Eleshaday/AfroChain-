import React, { useState } from 'react';

export default function CheckoutPage({ cart, totalPrice, onBackToCart }) {
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

            const result = await response.json();
            
            if (result.success) {
                setTransactionHash(result.transactionHash);
                alert(`Payment processed successfully! Transaction Hash: ${result.transactionHash}`);
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
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#2c1810' }}>
                Checkout
            </h1>

            {/* Order Summary */}
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
            }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c1810' }}>
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
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
            }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c1810' }}>
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Wallet Address:
                        </label>
                        <input
                            type="text"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            placeholder={network === 'ethereum' ? "Enter your Ethereum address (0x...)" : "Enter your Hedera account ID (0.0.123456)"}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '1rem',
                                marginBottom: '1rem'
                            }}
                        />
                        
                        {network === 'ethereum' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Private Key (for transaction signing):
                                </label>
                                <input
                                    type="password"
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    placeholder="Enter your private key (0x...)"
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        marginBottom: '1rem'
                                    }}
                                />
                                <p style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '1rem' }}>
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
                    style={{
                        background: isProcessing || !walletAddress ? '#ccc' : '#8B4513',
                        color: 'white',
                        padding: '1rem 2rem',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1.1rem',
                        cursor: isProcessing || !walletAddress ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isProcessing ? 'Processing...' : 'Pay with Blockchain'}
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
    );
}
