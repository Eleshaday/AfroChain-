import React, { useState } from 'react';
import CustomAlert from './CustomAlert';

export default function CheckoutPage({ cart, totalPrice, onBackToCart, onPaymentSuccess }) {
    const [paymentMethod, setPaymentMethod] = useState('eth'); // 'eth', 'hedera', 'usdc', 'usdt'
    const [network, setNetwork] = useState('ethereum');
    const [paymentToken, setPaymentToken] = useState('ETH'); // ETH, USDC, USDT, HBAR
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionHash, setTransactionHash] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlertData] = useState({});
    
    // Delivery location state
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
    });

    const handlePayment = async () => {
        // Get user from localStorage
        const authUser = localStorage.getItem('authUser');
        if (!authUser) {
            setAlertData({
                type: 'error',
                title: 'Wallet Not Connected',
                message: 'Please connect your wallet first',
                transactionHash: null
            });
            setShowAlert(true);
            return;
        }

        const user = JSON.parse(authUser);
        const userWalletAddress = user.walletAddress;

        if (!userWalletAddress) {
            setAlertData({
                type: 'error',
                title: 'Wallet Address Missing',
                message: 'Wallet address not found. Please reconnect your wallet.',
                transactionHash: null
            });
            setShowAlert(true);
            return;
        }

        // Validate delivery address
        if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.country) {
            setAlertData({
                type: 'warning',
                title: 'Missing Delivery Information',
                message: 'Please fill in all required delivery address fields (Street, City, Country)',
                transactionHash: null
            });
            setShowAlert(true);
            return;
        }

        setIsProcessing(true);
        
        try {
            // Simulate blockchain payment transaction
            console.log('Processing payment with wallet:', userWalletAddress);
            console.log('Payment details:', {
                amount: totalPrice,
                network,
                paymentToken,
                items: cart.length
            });

            // Simulate transaction delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate mock transaction hash
            const mockTxHash = `0x${Math.random().toString(16).substring(2)}${Date.now().toString(16)}`;
            setTransactionHash(mockTxHash);

            console.log('Payment successful! Transaction:', mockTxHash);
                
                // Store transaction in localStorage for history
                const transaction = {
                    id: Date.now(),
                hash: mockTxHash,
                    amount: totalPrice,
                network: network,
                paymentToken: paymentToken,
                walletAddress: userWalletAddress,
                deliveryAddress: deliveryAddress,
                    items: cart.map(item => ({
                    name: item.productName || item.coffeeName,
                        quantity: item.quantity,
                    price: parseFloat(item.price.replace(/[^0-9.-]+/g,""))
                    })),
                    timestamp: new Date().toISOString(),
                    status: 'completed'
                };
                
                // Save to transaction history
                const existingTransactions = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
                existingTransactions.unshift(transaction);
                localStorage.setItem('transactionHistory', JSON.stringify(existingTransactions));
                
            // Show custom success alert
            setAlertData({
                type: 'success',
                title: 'Payment Successful! 🎉',
                message: `Your order has been processed successfully!\n\nNetwork: ${network}\nToken: ${paymentToken}\n\nYou can track your delivery in the transaction history.`,
                transactionHash: mockTxHash
            });
            setShowAlert(true);
        } catch (error) {
            setAlertData({
                type: 'error',
                title: 'Payment Failed',
                message: error.message,
                transactionHash: null
            });
            setShowAlert(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
        setAlertData({});
        // If it was a success alert, redirect to transaction history
        if (alertData.type === 'success') {
            setTimeout(() => {
                onPaymentSuccess();
            }, 500);
        }
    };

    return (
        <div className="checkout-page">
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                <h2 style={{ 
                    color: 'var(--primary)', 
                    marginBottom: '2rem',
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: '700'
                }}>
                    💳 Decentralized Payment
                </h2>

                {/* Order Summary */}
                <div style={{
                    background: 'var(--background-color)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-color)',
                    maxWidth: '600px',
                    margin: '0 auto 2rem'
                }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Order Summary</h3>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {cart.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {item.productName || item.coffeeName} x {item.quantity}
                                </span>
                                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                                    ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '1.1rem',
                            fontWeight: 'bold'
                        }}>
                            <span style={{ color: 'var(--text-primary)' }}>Total:</span>
                            <span style={{ color: 'var(--primary)' }}>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                <div style={{ 
                    background: 'var(--card-background)',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-light)',
                    maxWidth: '600px',
                    margin: '0 auto 2rem'
                }}>
                    <h3 style={{ 
                        marginBottom: '1rem', 
                        color: 'var(--text-primary)'
                    }}>
                        <i className="fas fa-map-marker-alt"></i> Delivery Address
                    </h3>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                    }}>
                        Street Address *
                    </label>
                    <input
                        type="text"
                        value={deliveryAddress.street}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
                        placeholder="123 Main Street, Apt 4"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--border-radius)',
                            fontSize: '1rem',
                            background: 'var(--card-background)',
                            color: 'var(--text-primary)'
                        }}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                        }}>
                            City *
                        </label>
                        <input
                            type="text"
                            value={deliveryAddress.city}
                            onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                            placeholder="Addis Ababa"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--border-color)',
                                borderRadius: 'var(--border-radius)',
                                fontSize: '1rem',
                                background: 'var(--card-background)',
                                color: 'var(--text-primary)'
                            }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                        }}>
                            State/Region
                        </label>
                        <input
                            type="text"
                            value={deliveryAddress.state}
                            onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                            placeholder="Oromia"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--border-color)',
                                borderRadius: 'var(--border-radius)',
                                fontSize: '1rem',
                                background: 'var(--card-background)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                        }}>
                            Country *
                        </label>
                        <input
                            type="text"
                            value={deliveryAddress.country}
                            onChange={(e) => setDeliveryAddress({...deliveryAddress, country: e.target.value})}
                            placeholder="Ethiopia"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--border-color)',
                                borderRadius: 'var(--border-radius)',
                                fontSize: '1rem',
                                background: 'var(--card-background)',
                                color: 'var(--text-primary)'
                            }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                        }}>
                            Postal Code
                        </label>
                        <input
                            type="text"
                            value={deliveryAddress.postalCode}
                            onChange={(e) => setDeliveryAddress({...deliveryAddress, postalCode: e.target.value})}
                            placeholder="1000"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--border-color)',
                                borderRadius: 'var(--border-radius)',
                                fontSize: '1rem',
                                background: 'var(--card-background)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                </div>
            </div>

                {/* Payment Method */}
                <div style={{ 
                    background: 'var(--card-background)',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-light)',
                    maxWidth: '600px',
                    margin: '0 auto 2rem'
                }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        <i className="fas fa-credit-card"></i> Payment Method
                    </h3>
                
                    {/* Payment Method Options */}
                    <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {/* Hedera HBAR */}
                        <label style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            padding: '1.2rem',
                            border: `2px solid ${paymentMethod === 'hedera' ? 'var(--primary)' : 'var(--border-color)'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: paymentMethod === 'hedera' ? 'rgba(34, 139, 34, 0.05)' : 'var(--white)',
                            transition: 'all 0.3s ease'
                        }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="hedera"
                                checked={paymentMethod === 'hedera'}
                                onChange={(e) => {
                                    setPaymentMethod(e.target.value);
                                    setPaymentToken('HBAR');
                                    setNetwork('hedera');
                                }}
                                style={{ marginRight: '1rem', marginTop: '0.2rem', cursor: 'pointer' }}
                            />
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.3rem' }}>
                                    🟢 Hedera HBAR
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                    Fast, low-cost payments on Hedera network
                                </div>
                            </div>
                        </label>

                        {/* Ethereum ETH */}
                        <label style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            padding: '1.2rem',
                            border: `2px solid ${paymentMethod === 'eth' ? 'var(--primary)' : 'var(--border-color)'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: paymentMethod === 'eth' ? 'rgba(34, 139, 34, 0.05)' : 'var(--white)',
                            transition: 'all 0.3s ease'
                        }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="eth"
                                checked={paymentMethod === 'eth'}
                                onChange={(e) => {
                                    setPaymentMethod(e.target.value);
                                    setPaymentToken('ETH');
                                    setNetwork('ethereum');
                                }}
                                style={{ marginRight: '1rem', marginTop: '0.2rem', cursor: 'pointer' }}
                            />
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.3rem' }}>
                                    💎 Ethereum ETH
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                    Ethereum network payments (requires gas fees)
                                </div>
                            </div>
                        </label>

                        {/* USDC */}
                        <label style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            padding: '1.2rem',
                            border: `2px solid ${paymentMethod === 'usdc' ? 'var(--primary)' : 'var(--border-color)'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: paymentMethod === 'usdc' ? 'rgba(34, 139, 34, 0.05)' : 'var(--white)',
                            transition: 'all 0.3s ease'
                        }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="usdc"
                                checked={paymentMethod === 'usdc'}
                                onChange={(e) => {
                                    setPaymentMethod(e.target.value);
                                    setPaymentToken('USDC');
                                    setNetwork('ethereum');
                                }}
                                style={{ marginRight: '1rem', marginTop: '0.2rem', cursor: 'pointer' }}
                            />
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.3rem' }}>
                                    💵 USDC (USD Coin)
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                    Stablecoin pegged to USD (1 USDC = $1 USD)
                                </div>
                            </div>
                        </label>

                        {/* USDT (Tether) */}
                        <label style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            padding: '1.2rem',
                            border: `2px solid ${paymentMethod === 'usdt' ? 'var(--primary)' : 'var(--border-color)'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: paymentMethod === 'usdt' ? 'rgba(34, 139, 34, 0.05)' : 'var(--white)',
                            transition: 'all 0.3s ease'
                        }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="usdt"
                                checked={paymentMethod === 'usdt'}
                                onChange={(e) => {
                                    setPaymentMethod(e.target.value);
                                    setPaymentToken('USDT');
                                    setNetwork('ethereum');
                                }}
                                style={{ marginRight: '1rem', marginTop: '0.2rem', cursor: 'pointer' }}
                            />
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.3rem' }}>
                                    💵 USDT (Tether)
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                    Stablecoin pegged to USD (1 USDT = $1 USD)
                                </div>
                            </div>
                        </label>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                        }}>
                            Connected Wallet:
                        </label>
                        <div style={{
                            padding: '0.8rem',
                            background: 'rgba(34, 139, 34, 0.1)',
                            borderRadius: 'var(--border-radius)',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            border: '1px solid rgba(34, 139, 34, 0.3)'
                        }}>
                            {(() => {
                                const authUser = localStorage.getItem('authUser');
                                if (authUser) {
                                    const user = JSON.parse(authUser);
                                    return user.walletAddress || 'Not connected';
                                }
                                return 'Not connected';
                            })()}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(40, 167, 69, 0.1)',
                        padding: '1rem',
                        borderRadius: 'var(--border-radius)',
                        marginBottom: '1rem',
                        border: '1px solid rgba(40, 167, 69, 0.3)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#155724',
                            fontWeight: '600',
                            marginBottom: '0.5rem'
                        }}>
                            🔐 Secure Wallet Integration
                        </div>
                        <div style={{ color: '#155724', fontSize: '0.9rem' }}>
                            Your wallet will handle transaction signing securely. No private keys are required or stored.
                        </div>
                    </div>

                    {(paymentToken === 'USDC' || paymentToken === 'USDT') && (
                        <div style={{
                            background: 'rgba(0, 123, 255, 0.1)',
                            padding: '1rem',
                            borderRadius: 'var(--border-radius)',
                            marginBottom: '1rem',
                            border: '1px solid rgba(0, 123, 255, 0.3)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#004085',
                                fontWeight: '600',
                                marginBottom: '0.5rem'
                            }}>
                                💰 {paymentToken}
                            </div>
                            <div style={{ color: '#004085', fontSize: '0.9rem' }}>
                                Pay with {paymentToken} for price stability. 1 {paymentToken} = $1 USD. No volatility risk.
                            </div>
                        </div>
                    )}
                            
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0' }}>
                        Your payment will be processed using {paymentToken} on {network === 'ethereum' ? 'Ethereum' : 'Hedera'} blockchain for secure, transparent transactions.
                    </p>
                </div>

                {/* Transaction Status */}
                {transactionHash && (
                    <div style={{
                        background: '#d4edda',
                        color: '#155724',
                        padding: '1rem',
                        borderRadius: 'var(--border-radius)',
                        marginBottom: '2rem',
                        border: '1px solid #c3e6cb',
                        maxWidth: '600px',
                        margin: '0 auto 2rem'
                    }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>✅ Payment Successful!</h3>
                        <p>Transaction Hash: <code>{transactionHash}</code></p>
                        <p>Your order has been confirmed and will be processed.</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    justifyContent: 'center',
                    maxWidth: '600px',
                    margin: '0 auto 2rem'
                }}>
                    <button
                        onClick={onBackToCart}
                        style={{
                            background: '#6c757d',
                            color: 'white',
                            padding: '0.8rem 2rem',
                            border: 'none',
                            borderRadius: 'var(--border-radius)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'var(--transition)'
                        }}
                    >
                        ← Back to Cart
                    </button>
                    
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        style={{
                            background: isProcessing ? '#ccc' : 'var(--primary)',
                            color: 'white',
                            padding: '0.8rem 2rem',
                            border: 'none',
                            borderRadius: 'var(--border-radius)',
                            fontSize: '1rem',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            transition: 'var(--transition)'
                        }}
                    >
                        {isProcessing ? '⏳ Processing...' : '💳 Complete Payment'}
                    </button>
                </div>

                {/* Blockchain Info */}
                <div style={{
                    background: 'var(--background-color)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-color)',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                        🔗 About Blockchain Payments
                    </h3>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                        <li>Secure and transparent transactions</li>
                        <li>No intermediaries - direct farmer-to-buyer payments</li>
                        <li>Immutable transaction records</li>
                        <li>Lower transaction fees compared to traditional payment methods</li>
                        <li>Support for multiple cryptocurrencies (ETH, HBAR, USDC, USDT)</li>
                    </ul>
                </div>
            </div>
            
            {/* Custom Alert */}
            <CustomAlert
                isOpen={showAlert}
                onClose={handleCloseAlert}
                type={alertData.type}
                title={alertData.title}
                message={alertData.message}
                transactionHash={alertData.transactionHash}
            />
        </div>
    );
}
