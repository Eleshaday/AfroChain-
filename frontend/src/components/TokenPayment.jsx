import React, { useState, useEffect } from 'react';

export default function TokenPayment({ cart, totalPrice, onPaymentSuccess, onBack }) {
    const [paymentMethod, setPaymentMethod] = useState('hedera'); // 'hedera', 'ethereum', 'coffee_token'
    const [recipientAccountId, setRecipientAccountId] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);
    const [loyaltyReward, setLoyaltyReward] = useState(0);

    // Calculate loyalty reward (5% of purchase)
    useEffect(() => {
        const reward = Math.round(totalPrice * 0.05 * 100) / 100; // 5% reward
        setLoyaltyReward(reward);
    }, [totalPrice]);

    const handlePayment = async () => {
        if (!recipientAccountId.trim()) {
            alert('Please enter a recipient account ID');
            return;
        }

        if (paymentMethod === 'ethereum' && !privateKey.trim()) {
            alert('Please enter your private key for Ethereum payments');
            return;
        }

        setIsProcessing(true);
        setPaymentResult(null);

        try {
            let result;

            if (paymentMethod === 'hedera') {
                // Hedera HBAR payment
                result = await fetch('http://localhost:4000/api/process-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        walletAddress: recipientAccountId,
                        amount: totalPrice,
                        network: 'hedera',
                        items: cart
                    })
                });
            } else if (paymentMethod === 'ethereum') {
                // Ethereum payment
                result = await fetch('http://localhost:4000/api/process-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        walletAddress: recipientAccountId,
                        amount: totalPrice,
                        network: 'ethereum',
                        privateKey: privateKey,
                        items: cart
                    })
                });
            } else if (paymentMethod === 'coffee_token') {
                // Coffee token payment
                const tokenId = '0.0.123456'; // Default coffee token ID
                result = await fetch('http://localhost:4000/api/tokens/payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tokenId: tokenId,
                        recipientAccountId: recipientAccountId,
                        amount: Math.round(totalPrice * 100), // Convert to token units (2 decimals)
                        memo: `CoffeeDirect purchase: ${cart.map(item => item.coffeeName).join(', ')}`
                    })
                });
            }

            const data = await result.json();
            setPaymentResult(data);

            if (data.success) {
                // Process loyalty reward
                try {
                    const loyaltyResult = await fetch('http://localhost:4000/api/tokens/loyalty/reward', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            recipientAccountId: recipientAccountId,
                            rewardAmount: Math.round(loyaltyReward * 100), // Convert to token units
                            reason: `Loyalty reward for purchase of ${cart.map(item => item.coffeeName).join(', ')}`
                        })
                    });
                    const loyaltyData = await loyaltyResult.json();
                    console.log('Loyalty reward processed:', loyaltyData);
                } catch (error) {
                    console.error('Loyalty reward error:', error);
                }

                // Call success callback after a delay
                setTimeout(() => {
                    onPaymentSuccess();
                }, 2000);
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentResult({
                success: false,
                error: 'Payment processing failed'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'hedera': return '🟢';
            case 'ethereum': return '🔷';
            case 'coffee_token': return '☕';
            default: return '💰';
        }
    };

    const getPaymentMethodName = (method) => {
        switch (method) {
            case 'hedera': return 'Hedera HBAR';
            case 'ethereum': return 'Ethereum ETH';
            case 'coffee_token': return 'CoffeeDirect Token';
            default: return 'Unknown';
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
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                💳 Decentralized Payment
            </h2>

            {/* Payment Summary */}
            <div style={{
                background: 'var(--background-color)',
                padding: '1.5rem',
                borderRadius: 'var(--border-radius)',
                marginBottom: '2rem',
                border: '1px solid var(--border-color)'
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
                                {item.coffeeName} x {item.quantity}
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
                        <span style={{ color: 'var(--primary-color)' }}>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Payment Method Selection */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Payment Method</h3>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {['hedera', 'ethereum', 'coffee_token'].map((method) => (
                        <label key={method} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1rem',
                            border: `2px solid ${paymentMethod === method ? 'var(--primary-color)' : 'var(--border-color)'}`,
                            borderRadius: 'var(--border-radius)',
                            cursor: 'pointer',
                            background: paymentMethod === method ? 'rgba(139, 69, 19, 0.1)' : 'var(--background-color)',
                            transition: 'var(--transition)'
                        }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={paymentMethod === method}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                style={{ marginRight: '1rem' }}
                            />
                            <div>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.5rem',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)'
                                }}>
                                    <span>{getPaymentMethodIcon(method)}</span>
                                    {getPaymentMethodName(method)}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {method === 'hedera' && 'Fast, low-cost payments on Hedera network'}
                                    {method === 'ethereum' && 'Ethereum network payments (requires gas fees)'}
                                    {method === 'coffee_token' && 'CoffeeDirect ecosystem token payments'}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Recipient Account */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                }}>
                    Recipient Account ID
                </label>
                <input
                    type="text"
                    value={recipientAccountId}
                    onChange={(e) => setRecipientAccountId(e.target.value)}
                    placeholder={paymentMethod === 'ethereum' ? '0x...' : '0.0.123456'}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '1rem',
                        background: 'var(--background-color)',
                        color: 'var(--text-primary)',
                        transition: 'var(--transition)'
                    }}
                />
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {paymentMethod === 'ethereum' && 'Enter the Ethereum wallet address of the coffee farmer'}
                    {paymentMethod === 'hedera' && 'Enter the Hedera account ID of the coffee farmer'}
                    {paymentMethod === 'coffee_token' && 'Enter the Hedera account ID to receive coffee tokens'}
                </div>
            </div>

            {/* Private Key (Ethereum only) */}
            {paymentMethod === 'ethereum' && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                    }}>
                        Private Key (for signing transaction)
                    </label>
                    <input
                        type="password"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        placeholder="0x..."
                        style={{
                            width: '100%',
                            padding: '1rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--border-radius)',
                            fontSize: '1rem',
                            background: 'var(--background-color)',
                            color: 'var(--text-primary)',
                            transition: 'var(--transition)'
                        }}
                    />
                    <div style={{ fontSize: '0.9rem', color: 'var(--warning-color)', marginTop: '0.5rem' }}>
                        ⚠️ Private key is used only for signing the transaction and is not stored
                    </div>
                </div>
            )}

            {/* Loyalty Reward Info */}
            <div style={{
                background: 'rgba(40, 167, 69, 0.1)',
                padding: '1rem',
                borderRadius: 'var(--border-radius)',
                marginBottom: '2rem',
                border: '1px solid rgba(40, 167, 69, 0.3)'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    color: '#155724',
                    fontWeight: '600'
                }}>
                    🎁 Loyalty Reward
                </div>
                <div style={{ color: '#155724', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    You will receive <strong>{loyaltyReward} COFFEECOIN</strong> tokens as a loyalty reward for this purchase!
                </div>
            </div>

            {/* Payment Result */}
            {paymentResult && (
                <div style={{
                    padding: '1rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem',
                    border: `2px solid ${paymentResult.success ? 'var(--success-color)' : 'var(--error-color)'}`,
                    background: paymentResult.success ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'
                }}>
                    {paymentResult.success ? (
                        <div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                color: '#155724',
                                fontWeight: '600',
                                marginBottom: '0.5rem'
                            }}>
                                ✅ Payment Successful!
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#155724' }}>
                                Transaction ID: <code>{paymentResult.transactionHash || paymentResult.transactionId}</code>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#155724', marginTop: '0.5rem' }}>
                                Network: {paymentResult.network}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                color: '#721c24',
                                fontWeight: '600',
                                marginBottom: '0.5rem'
                            }}>
                                ❌ Payment Failed
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#721c24' }}>
                                {paymentResult.error}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={onBack}
                    disabled={isProcessing}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        opacity: isProcessing ? 0.6 : 1,
                        transition: 'var(--transition)'
                    }}
                >
                    ← Back to Cart
                </button>
                <button
                    onClick={handlePayment}
                    disabled={isProcessing || !recipientAccountId.trim()}
                    style={{
                        flex: 2,
                        padding: '1rem',
                        background: isProcessing ? '#6c757d' : 'var(--gradient-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        transition: 'var(--transition)'
                    }}
                >
                    {isProcessing ? '🔄 Processing...' : `💳 Pay ${getPaymentMethodIcon(paymentMethod)} ${totalPrice.toFixed(2)}`}
                </button>
            </div>
        </div>
    );
}
