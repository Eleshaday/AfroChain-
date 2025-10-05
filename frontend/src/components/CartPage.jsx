import React from 'react';

export default function CartPage({ cart, onRemoveFromCart, onUpdateQuantity, onProceedToBuy, totalPrice }) {
    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <h1 className="section-title">
                    Your Cart is Empty
                </h1>
                <div style={{
                    background: 'var(--card-background)',
                    padding: '3rem',
                    borderRadius: 'var(--border-radius)',
                    boxShadow: 'var(--shadow-light)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Discover our premium Ethiopian coffee beans and add them to your cart!
                    </p>
                    <button 
                        onClick={() => window.location.href = '/products'}
                        className="add-to-cart-btn"
                    >
                        🛍️ Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1 className="section-title">
                Shopping Cart
            </h1>
            <p style={{ 
                textAlign: 'center', 
                color: 'var(--success-color)', 
                marginBottom: '2rem',
                fontSize: '0.9rem'
            }}>
                💾 Cart automatically saved to your browser
            </p>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                {cart.map((item, index) => (
                    <div 
                        key={item.id} 
                        className="cart-item"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <img 
                            src={item.image} 
                            alt={item.coffeeName}
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                        
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#2c1810' }}>
                                {item.coffeeName}
                            </h3>
                            <p style={{ color: '#8B4513', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                {item.farmerName}
                            </p>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                {item.origin} • {item.qualityLevel}
                            </p>
                            {item.certification && (
                                <span style={{
                                    background: '#28a745',
                                    color: 'white',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '10px',
                                    fontSize: '0.8rem',
                                    marginTop: '0.5rem',
                                    display: 'inline-block'
                                }}>
                                    {item.certification}
                                </span>
                            )}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    style={{
                                        background: '#f8f9fa',
                                        border: '1px solid #ddd',
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        marginRight: '0.5rem'
                                    }}
                                >
                                    -
                                </button>
                                <span style={{ margin: '0 0.5rem', fontWeight: 'bold' }}>
                                    {item.quantity}
                                </span>
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    style={{
                                        background: '#f8f9fa',
                                        border: '1px solid #ddd',
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        marginLeft: '0.5rem'
                                    }}
                                >
                                    +
                                </button>
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#8B4513' }}>
                                ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                            </div>
                        </div>

                        <button 
                            onClick={() => onRemoveFromCart(item.id)}
                            style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="cart-total">
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    Order Summary
                </h2>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span>Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} items):</span>
                    <span style={{ fontWeight: 'bold' }}>${totalPrice.toFixed(2)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span>Shipping:</span>
                    <span style={{ fontWeight: 'bold' }}>Free</span>
                </div>
                
                <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #eee' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: '#2c1810' }}>
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            {/* Proceed to Buy Button */}
            <div style={{ textAlign: 'center' }}>
                <button 
                    onClick={onProceedToBuy}
                    className="proceed-btn"
                >
                    💳 Proceed to Buy
                </button>
            </div>
        </div>
    );
}
