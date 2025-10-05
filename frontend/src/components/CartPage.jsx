import React from 'react';

export default function CartPage({ cart, onRemoveFromCart, onUpdateQuantity, onProceedToBuy, totalPrice }) {
    if (cart.length === 0) {
        return (
            <div style={{ 
                padding: '4rem 2rem', 
                textAlign: 'center',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#2c1810' }}>
                    Your Cart is Empty
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
                    Discover our premium Ethiopian coffee beans and add them to your cart!
                </p>
                <button 
                    onClick={() => window.location.href = '/products'}
                    style={{
                        background: '#8B4513',
                        color: 'white',
                        padding: '1rem 2rem',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1.1rem',
                        cursor: 'pointer'
                    }}
                >
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#2c1810' }}>
                Shopping Cart
            </h1>
            <p style={{ 
                textAlign: 'center', 
                color: '#28a745', 
                marginBottom: '2rem',
                fontSize: '0.9rem'
            }}>
                💾 Cart automatically saved to your browser
            </p>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                {cart.map(item => (
                    <div key={item.id} style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        display: 'grid',
                        gridTemplateColumns: '100px 1fr auto auto',
                        gap: '1rem',
                        alignItems: 'center'
                    }}>
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
                    style={{
                        background: '#8B4513',
                        color: 'white',
                        padding: '1rem 3rem',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#A0522D'}
                    onMouseOut={(e) => e.target.style.background = '#8B4513'}
                >
                    Proceed to Buy
                </button>
            </div>
        </div>
    );
}
