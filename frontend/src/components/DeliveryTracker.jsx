import React, { useState, useEffect } from 'react';

export default function DeliveryTracker({ orderId, onBack }) {
    const [trackingData, setTrackingData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading tracking data
        setTimeout(() => {
            // Get transaction from localStorage
            const transactions = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
            console.log('Looking for order:', orderId);
            console.log('Available transactions:', transactions);
            
            let transaction = transactions.find(t => t.id.toString() === orderId?.toString());
            
            // If no specific order, use the most recent one
            if (!transaction && transactions.length > 0) {
                transaction = transactions[0];
                console.log('Using most recent transaction:', transaction);
            }
            
            if (transaction) {
                // Generate mock tracking data based on transaction
                const mockTracking = generateMockTracking(transaction);
                setTrackingData(mockTracking);
            }
            setIsLoading(false);
        }, 500);
    }, [orderId]);

    const generateMockTracking = (transaction) => {
        const orderDate = new Date(transaction.timestamp);
        const now = new Date();
        const daysSinceOrder = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        
        let currentStage = 0;
        if (daysSinceOrder >= 1) currentStage = 1;
        if (daysSinceOrder >= 3) currentStage = 2;
        if (daysSinceOrder >= 5) currentStage = 3;
        if (daysSinceOrder >= 7) currentStage = 4;

        const stages = [
            {
                name: 'Order Confirmed',
                description: 'Your order has been confirmed and is being prepared',
                timestamp: transaction.timestamp,
                location: 'FarmerChain Platform',
                status: 'completed',
                icon: 'fa-check-circle'
            },
            {
                name: 'Processing',
                description: 'Farmer is preparing your products for shipment',
                timestamp: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
                location: transaction.items[0]?.name ? 'Farm Location' : 'Processing Center',
                status: currentStage >= 1 ? 'completed' : 'pending',
                icon: 'fa-box'
            },
            {
                name: 'Shipped',
                description: 'Products have been picked up by courier',
                timestamp: new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Distribution Center',
                status: currentStage >= 2 ? 'completed' : currentStage === 1 ? 'in_progress' : 'pending',
                icon: 'fa-truck'
            },
            {
                name: 'In Transit',
                description: 'Your products are on their way',
                timestamp: new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'En Route',
                status: currentStage >= 3 ? 'completed' : currentStage === 2 ? 'in_progress' : 'pending',
                icon: 'fa-shipping-fast'
            },
            {
                name: 'Delivered',
                description: 'Products have been delivered',
                timestamp: new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Your Address',
                status: currentStage >= 4 ? 'completed' : currentStage === 3 ? 'in_progress' : 'pending',
                icon: 'fa-home'
            }
        ];

        const estimatedDelivery = new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        return {
            orderId: transaction.hash,
            orderDate: transaction.timestamp,
            estimatedDelivery: estimatedDelivery.toISOString(),
            currentStage,
            stages,
            items: transaction.items,
            totalAmount: transaction.amount,
            deliveryAddress: transaction.deliveryAddress || null
        };
    };

    const getStageColor = (status) => {
        switch (status) {
            case 'completed': return '#28a745';
            case 'in_progress': return '#ffc107';
            case 'pending': return '#ccc';
            default: return '#ccc';
        }
    };

    if (isLoading) {
        return (
            <div className="delivery-tracker" style={{ padding: '2rem', textAlign: 'center' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
                <p>Loading tracking information...</p>
            </div>
        );
    }

    if (!trackingData) {
        return (
            <div className="delivery-tracker" style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Order Not Found</h2>
                <p>Unable to find tracking information for this order.</p>
                <button className="btn btn-primary" onClick={onBack}>
                    Back to Transactions
                </button>
            </div>
        );
    }

    return (
        <div className="delivery-tracker">
            <div className="container" style={{ maxWidth: '900px', padding: '2rem' }}>
                <button 
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <i className="fas fa-arrow-left"></i> Back to Transactions
                </button>

                <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                    <i className="fas fa-shipping-fast"></i> Track Your Delivery
                </h1>

                {/* Order Summary */}
                <div style={{
                    background: 'var(--secondary)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem',
                    boxShadow: 'var(--shadow-light)'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <strong style={{ color: 'var(--text)' }}>Order ID:</strong>
                            <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', margin: '0.5rem 0 0 0', wordBreak: 'break-all' }}>
                                {trackingData.orderId.slice(0, 20)}...
                            </p>
                        </div>
                        <div>
                            <strong style={{ color: 'var(--text)' }}>Order Date:</strong>
                            <p style={{ margin: '0.5rem 0 0 0' }}>
                                {new Date(trackingData.orderDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <strong style={{ color: 'var(--text)' }}>Est. Delivery:</strong>
                            <p style={{ margin: '0.5rem 0 0 0' }}>
                                {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <strong style={{ color: 'var(--text)' }}>Total Amount:</strong>
                            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--primary)', fontWeight: '600' }}>
                                ${trackingData.totalAmount.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    
                    {/* Delivery Address */}
                    {trackingData.deliveryAddress && (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34, 139, 34, 0.1)', borderRadius: '8px' }}>
                            <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>
                                <i className="fas fa-map-marker-alt"></i> Delivery Address:
                            </strong>
                            <p style={{ margin: 0, color: 'var(--text)', lineHeight: '1.6' }}>
                                {trackingData.deliveryAddress.street}<br/>
                                {trackingData.deliveryAddress.city}{trackingData.deliveryAddress.state && `, ${trackingData.deliveryAddress.state}`}<br/>
                                {trackingData.deliveryAddress.country} {trackingData.deliveryAddress.postalCode}
                            </p>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div style={{
                    background: 'var(--white)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem',
                    boxShadow: 'var(--shadow-light)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                        <i className="fas fa-shopping-bag"></i> Items in this Order
                    </h3>
                    {trackingData.items.map((item, index) => (
                        <div key={index} style={{
                            padding: '0.75rem',
                            borderBottom: index < trackingData.items.length - 1 ? '1px solid var(--border-color)' : 'none'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text)' }}>{item.name}</span>
                                <span style={{ color: 'var(--text-light)' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tracking Timeline */}
                <div style={{
                    background: 'var(--white)',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    boxShadow: 'var(--shadow-medium)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>
                        <i className="fas fa-route"></i> Delivery Progress
                    </h3>
                    
                    <div style={{ position: 'relative' }}>
                        {/* Progress Line */}
                        <div style={{
                            position: 'absolute',
                            left: '1.5rem',
                            top: '0',
                            bottom: '0',
                            width: '3px',
                            background: 'var(--border-color)'
                        }}></div>

                        {trackingData.stages.map((stage, index) => (
                            <div key={index} style={{
                                position: 'relative',
                                paddingLeft: '4rem',
                                paddingBottom: '2rem',
                                paddingTop: index === 0 ? '0' : '1rem'
                            }}>
                                {/* Icon */}
                                <div style={{
                                    position: 'absolute',
                                    left: '0',
                                    top: index === 0 ? '0' : '1rem',
                                    width: '3rem',
                                    height: '3rem',
                                    borderRadius: '50%',
                                    background: getStageColor(stage.status),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    zIndex: 1
                                }}>
                                    <i className={`fas ${stage.icon}`}></i>
                                </div>

                                {/* Content */}
                                <div style={{
                                    background: stage.status === 'in_progress' ? 'rgba(255, 193, 7, 0.1)' : 'transparent',
                                    padding: '1rem',
                                    borderRadius: 'var(--border-radius)',
                                    border: stage.status === 'in_progress' ? '2px solid #ffc107' : 'none'
                                }}>
                                    <h4 style={{ 
                                        color: stage.status === 'completed' ? '#28a745' : stage.status === 'in_progress' ? '#ffc107' : 'var(--text)',
                                        marginBottom: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        {stage.name}
                                        {stage.status === 'in_progress' && (
                                            <span style={{ 
                                                fontSize: '0.75rem', 
                                                background: '#ffc107', 
                                                color: 'white', 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '12px' 
                                            }}>
                                                In Progress
                                            </span>
                                        )}
                                    </h4>
                                    <p style={{ color: 'var(--text-light)', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                                        {stage.description}
                                    </p>
                                    {stage.status !== 'pending' && (
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                                            <i className="fas fa-map-marker-alt"></i> {stage.location}
                                            {' • '}
                                            <i className="fas fa-clock"></i> {new Date(stage.timestamp).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Support */}
                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'rgba(34, 139, 34, 0.1)',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid rgba(34, 139, 34, 0.3)',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: 0, color: 'var(--text)' }}>
                        <i className="fas fa-question-circle"></i> Need help with your order? 
                        <a href="#" style={{ color: 'var(--primary)', marginLeft: '0.5rem', fontWeight: '600' }}>
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
