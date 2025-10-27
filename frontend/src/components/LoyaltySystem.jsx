import React, { useState, useEffect } from 'react';
import CustomAlert from './CustomAlert';

export default function LoyaltySystem({ onBack }) {
    const [userAccountId, setUserAccountId] = useState('');
    const [loyaltyBalance, setLoyaltyBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlertData] = useState({});

    // Mock loyalty data
    const [loyaltyData, setLoyaltyData] = useState({
        accountId: '',
        balance: 0,
        totalEarned: 0,
        level: 'Bronze',
        nextLevel: 'Silver',
        progressToNext: 30,
        coupons: [
            {
                id: 1,
                name: '10% Off Sidama Coffee',
                description: 'Get 10% off any Sidama region coffee',
                discount: 10,
                type: 'percentage',
                validUntil: '2024-12-31',
                used: false,
                coffeeType: 'Sidama'
            },
            {
                id: 2,
                name: '$5 Off Premium Coffee',
                description: 'Save $5 on any premium grade coffee',
                discount: 5,
                type: 'fixed',
                validUntil: '2024-12-31',
                used: false,
                coffeeType: 'Premium'
            },
            {
                id: 3,
                name: 'Free Shipping',
                description: 'Free shipping on orders over $50',
                discount: 0,
                type: 'shipping',
                validUntil: '2024-12-31',
                used: false,
                coffeeType: 'Any'
            }
        ],
        rewards: [
            {
                id: 1,
                name: 'Coffee Tasting Kit',
                description: 'Sample 5 different Ethiopian coffee varieties',
                cost: 500,
                available: true,
                image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300'
            },
            {
                id: 2,
                name: 'Premium Roasting Class',
                description: 'Learn coffee roasting from Ethiopian masters',
                cost: 1000,
                available: true,
                image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300'
            },
            {
                id: 3,
                name: 'Farm Visit Experience',
                description: 'Visit coffee farms in Ethiopia (travel not included)',
                cost: 2000,
                available: false,
                image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300'
            }
        ]
    });

    useEffect(() => {
        // Load user's loyalty data when component mounts
        loadLoyaltyData();
    }, []);

    const loadLoyaltyData = async () => {
        setIsLoading(true);
        try {
            // Simulate API call to get loyalty data
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock data - in real app, this would come from API
            setLoyaltyBalance(loyaltyData.balance);
            setCoupons(loyaltyData.coupons);
            setRewards(loyaltyData.rewards);
        } catch (error) {
            console.error('Failed to load loyalty data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckBalance = async () => {
        if (!userAccountId.trim()) {
            setAlertData({
                type: 'warning',
                title: 'Missing Information',
                message: 'Please enter your Hedera account ID',
                transactionHash: null
            });
            setShowAlert(true);
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call to check token balance
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tokens/balance/${userAccountId}/0.0.123456`);
            const data = await response.json();
            
            if (data.success) {
                setLoyaltyBalance(data.balance / 100); // Convert from token units
                setLoyaltyData(prev => ({
                    ...prev,
                    accountId: userAccountId,
                    balance: data.balance / 100
                }));
            } else {
                setAlertData({
                    type: 'error',
                    title: 'Balance Check Failed',
                    message: 'Failed to check balance: ' + data.error,
                    transactionHash: null
                });
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Balance check error:', error);
            // Use mock data for demonstration
            setLoyaltyBalance(1250);
            setLoyaltyData(prev => ({
                ...prev,
                accountId: userAccountId,
                balance: 1250
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseCoupon = (couponId) => {
        setCoupons(coupons.map(coupon => 
            coupon.id === couponId 
                ? { ...coupon, used: true }
                : coupon
        ));
        setAlertData({
            type: 'success',
            title: 'Coupon Activated! 🎉',
            message: 'Your coupon has been activated successfully. Apply it during checkout to save!',
            transactionHash: null
        });
        setShowAlert(true);
    };

    const handleRedeemReward = async (rewardId) => {
        const reward = rewards.find(r => r.id === rewardId);
        if (!reward) return;

        if (loyaltyBalance < reward.cost) {
            setAlertData({
                type: 'warning',
                title: 'Insufficient Balance',
                message: `You need ${reward.cost} AGRITOKEN but only have ${loyaltyBalance} AGRITOKEN. Earn more by making purchases!`,
                transactionHash: null
            });
            setShowAlert(true);
            return;
        }

        try {
            // Simulate API call to redeem reward
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setLoyaltyBalance(prev => prev - reward.cost);
            setLoyaltyData(prev => ({
                ...prev,
                balance: prev.balance - reward.cost
            }));
            
            setAlertData({
                type: 'success',
                title: 'Reward Redeemed! 🎁',
                message: `Successfully redeemed ${reward.name}! ${reward.cost} AGRITOKEN has been deducted from your balance. Check your email for redemption details.`,
                transactionHash: null
            });
            setShowAlert(true);
        } catch (error) {
            setAlertData({
                type: 'error',
                title: 'Redemption Failed',
                message: 'Failed to redeem reward. Please try again later.',
                transactionHash: null
            });
            setShowAlert(true);
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Bronze': return '#CD7F32';
            case 'Silver': return '#C0C0C0';
            case 'Gold': return '#FFD700';
            case 'Platinum': return '#E5E4E2';
            default: return '#6c757d';
        }
    };

    const getLevelIcon = (level) => {
        switch (level) {
            case 'Bronze': return '🥉';
            case 'Silver': return '🥈';
            case 'Gold': return '🥇';
            case 'Platinum': return '💎';
            default: return '⭐';
        }
    };

    if (isLoading && !loyaltyData.accountId) {
        return (
            <div style={{
                background: 'var(--card-background)',
                padding: '2rem',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow-light)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    color: 'var(--text-secondary)'
                }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid var(--primary-color)',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    Loading loyalty data...
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: 'var(--card-background)',
            padding: '2rem',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-light)',
            border: '1px solid var(--border-color)',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <h2 style={{ 
                    color: 'var(--primary-color)', 
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    🎁 FarmerChain Loyalty Program
                </h2>
                <button
                    onClick={onBack}
                    style={{
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--border-radius)',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600'
                    }}
                >
                    ← Back
                </button>
            </div>

            {/* Account Setup */}
            {!loyaltyData.accountId && (
                <div style={{
                    background: 'var(--background-color)',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Connect Your Account</h3>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        Enter your Hedera account ID to check your AGRITOKEN balance and access rewards.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem', 
                                fontWeight: '600',
                                color: 'var(--text-primary)'
                            }}>
                                Hedera Account ID
                            </label>
                            <input
                                type="text"
                                value={userAccountId}
                                onChange={(e) => setUserAccountId(e.target.value)}
                                placeholder="0.0.123456"
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
                        <button
                            onClick={handleCheckBalance}
                            disabled={isLoading || !userAccountId.trim()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: isLoading ? '#6c757d' : 'var(--gradient-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--border-radius)',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}
                        >
                            {isLoading ? '🔄 Checking...' : '🔍 Check Balance'}
                        </button>
                    </div>
                </div>
            )}

            {/* Loyalty Dashboard */}
            {loyaltyData.accountId && (
                <div style={{
                    background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem'
                    }}>
                        <div>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>AGRITOKEN Balance</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                {loyaltyBalance.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                Total Earned: {loyaltyData.totalEarned.toLocaleString()}
                            </div>
                        </div>
                        
                        <div>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Loyalty Level</h3>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}>
                                <span>{getLevelIcon(loyaltyData.level)}</span>
                                {loyaltyData.level}
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.5rem' }}>
                                {loyaltyData.progressToNext}% to {loyaltyData.nextLevel}
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '4px',
                                marginTop: '0.5rem'
                            }}>
                                <div style={{
                                    width: `${loyaltyData.progressToNext}%`,
                                    height: '100%',
                                    background: 'white',
                                    borderRadius: '4px',
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Account</h3>
                            <div style={{ fontSize: '0.9rem', fontFamily: 'monospace', opacity: 0.9 }}>
                                {loyaltyData.accountId}
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
                                Connected to Hedera Network
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Digital Coupons */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>🎫 Digital Coupons</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {coupons.map((coupon) => (
                        <div key={coupon.id} style={{
                            background: coupon.used ? 'var(--background-color)' : 'var(--card-background)',
                            padding: '1.5rem',
                            borderRadius: 'var(--border-radius)',
                            border: `2px solid ${coupon.used ? '#6c757d' : 'var(--primary-color)'}`,
                            opacity: coupon.used ? 0.6 : 1,
                            transition: 'var(--transition)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '1rem'
                            }}>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>
                                        {coupon.name}
                                    </h4>
                                    <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {coupon.description}
                                    </p>
                                </div>
                                <div style={{
                                    background: coupon.used ? '#6c757d' : 'var(--success-color)',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    {coupon.used ? 'USED' : 'ACTIVE'}
                                </div>
                            </div>
                            
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                        {coupon.type === 'percentage' ? `${coupon.discount}%` : 
                                         coupon.type === 'fixed' ? `$${coupon.discount}` : 'FREE'}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        Valid until {coupon.validUntil}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {coupon.coffeeType}
                                    </div>
                                </div>
                            </div>
                            
                            {!coupon.used && (
                                <button
                                    onClick={() => handleUseCoupon(coupon.id)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'var(--gradient-primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--border-radius)',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    🎟️ Use Coupon
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Rewards Shop */}
            <div>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>🏆 Rewards Shop</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {rewards.map((reward) => (
                        <div key={reward.id} style={{
                            background: 'var(--card-background)',
                            padding: '1.5rem',
                            borderRadius: 'var(--border-radius)',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            opacity: reward.available ? 1 : 0.6
                        }}>
                            <img
                                src={reward.image}
                                alt={reward.name}
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: 'var(--border-radius)',
                                    marginBottom: '1rem'
                                }}
                            />
                            
                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                                {reward.name}
                            </h4>
                            
                            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {reward.description}
                            </p>
                            
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>☕</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                        {reward.cost.toLocaleString()} AGRITOKEN
                                    </span>
                                </div>
                                
                                {!reward.available && (
                                    <span style={{
                                        background: '#dc3545',
                                        color: 'white',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                    }}>
                                        SOLD OUT
                                    </span>
                                )}
                            </div>
                            
                            <button
                                onClick={() => handleRedeemReward(reward.id)}
                                disabled={!reward.available || loyaltyBalance < reward.cost}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: (!reward.available || loyaltyBalance < reward.cost) ? '#6c757d' : 'var(--gradient-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--border-radius)',
                                    cursor: (!reward.available || loyaltyBalance < reward.cost) ? 'not-allowed' : 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '600'
                                }}
                            >
                                {!reward.available ? '❌ Sold Out' :
                                 loyaltyBalance < reward.cost ? '💰 Insufficient Balance' :
                                 '🎁 Redeem Reward'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div style={{
                marginTop: '2rem',
                background: 'rgba(40, 167, 69, 0.1)',
                padding: '1.5rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid rgba(40, 167, 69, 0.3)'
            }}>
                <h4 style={{ color: '#155724', marginBottom: '1rem' }}>🌾 How AGRITOKEN Works</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                        <strong style={{ color: '#155724' }}>Earn Rewards</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Get 5% back in AGRITOKEN on every purchase
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Digital Coupons</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Receive exclusive coupons and discounts
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Redeem Rewards</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Use AGRITOKEN for experiences and products
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Blockchain Secure</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Your rewards are secured on Hedera blockchain
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Custom Alert */}
            <CustomAlert
                isOpen={showAlert}
                onClose={() => setShowAlert(false)}
                type={alertData.type}
                title={alertData.title}
                message={alertData.message}
                transactionHash={alertData.transactionHash}
            />
        </div>
    );
}
