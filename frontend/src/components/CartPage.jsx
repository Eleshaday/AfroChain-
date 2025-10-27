import React from 'react';

export default function CartPage({ cart, onRemoveFromCart, onUpdateQuantity, onProceedToBuy, totalPrice, setCurrentPage }) {
    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="container" style={{ maxWidth: '800px', padding: '2rem', textAlign: 'center' }}>
                    <div style={{
                        background: 'var(--white)',
                        padding: '4rem 2rem',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
                        <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                    Your Cart is Empty
                </h1>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '2rem' }}>
                            Discover our premium agricultural products and add them to your cart!
                    </p>
                    <button 
                            onClick={() => setCurrentPage('products')}
                            className="btn btn-primary btn-large"
                            style={{ fontSize: '1.1rem' }}
                    >
                            <i className="fas fa-shopping-bag"></i> Browse Products
                    </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container" style={{ maxWidth: '1200px', padding: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
                    <i className="fas fa-shopping-cart"></i> Shopping Cart
            </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>
                    {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Cart Items */}
                    <div>
                {cart.map((item, index) => (
                    <div 
                        key={item.id} 
                                style={{
                                    background: 'var(--white)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    marginBottom: '1rem',
                                    boxShadow: 'var(--shadow)',
                                    border: '1px solid var(--border-color)',
                                    display: 'grid',
                                    gridTemplateColumns: '120px 1fr auto',
                                    gap: '1.5rem',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {/* Product Image */}
                        <img 
                            src={item.image} 
                                    alt={item.productName || item.coffeeName}
                                    style={{ 
                                        width: '120px', 
                                        height: '120px', 
                                        objectFit: 'cover', 
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                />
                                
                                {/* Product Info */}
                        <div>
                                    <h3 style={{ 
                                        fontSize: '1.3rem', 
                                        marginBottom: '0.5rem', 
                                        color: 'var(--primary)',
                                        fontWeight: '600'
                                    }}>
                                        {item.productName || item.coffeeName}
                            </h3>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.3rem', margin: '0 0 0.3rem 0' }}>
                                        <i className="fas fa-user"></i> {item.farmerName}
                            </p>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                                        <i className="fas fa-map-marker-alt"></i> {item.origin}
                            </p>
                                    {item.category && (
                                        <span className="category-badge" style={{ fontSize: '0.75rem' }}>
                                            {item.category}
                                        </span>
                                    )}
                            {item.certification && (
                                <span style={{
                                            background: 'rgba(40, 167, 69, 0.1)',
                                            color: '#28a745',
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            marginLeft: '0.5rem',
                                            fontWeight: '600'
                                        }}>
                                            <i className="fas fa-certificate"></i> {item.certification}
                                </span>
                            )}
                        </div>

                                {/* Quantity and Price Controls */}
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ 
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        justifyContent: 'flex-end'
                                    }}>
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    style={{
                                                background: 'var(--secondary)',
                                                border: '2px solid var(--primary)',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '6px',
                                        cursor: 'pointer',
                                                color: 'var(--primary)',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'var(--primary)';
                                                e.target.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'var(--secondary)';
                                                e.target.style.color = 'var(--primary)';
                                            }}
                                        >
                                            −
                                </button>
                                        <span style={{ 
                                            fontWeight: 'bold', 
                                            fontSize: '1.2rem',
                                            minWidth: '40px',
                                            textAlign: 'center',
                                            color: 'var(--text)'
                                        }}>
                                    {item.quantity}
                                </span>
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    style={{
                                                background: 'var(--secondary)',
                                                border: '2px solid var(--primary)',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '6px',
                                        cursor: 'pointer',
                                                color: 'var(--primary)',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'var(--primary)';
                                                e.target.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'var(--secondary)';
                                                e.target.style.color = 'var(--primary)';
                                    }}
                                >
                                    +
                                </button>
                            </div>
                                    <div style={{ 
                                        fontSize: '1.4rem', 
                                        fontWeight: 'bold', 
                                        color: 'var(--primary)',
                                        marginBottom: '1rem'
                                    }}>
                                        ${(parseFloat(item.price.replace(/[^0-9.-]+/g,"")) * item.quantity).toFixed(2)}
                                    </div>
                                    <button 
                                        onClick={() => onRemoveFromCart(item.id)}
                                        style={{
                                            background: 'transparent',
                                            color: '#dc3545',
                                            border: '2px solid #dc3545',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '25px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#dc3545';
                                            e.target.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#dc3545';
                                        }}
                                    >
                                        <i className="fas fa-trash"></i> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Card */}
                    <div style={{
                        background: 'var(--secondary)',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow)',
                        border: '2px solid var(--primary)',
                        position: 'sticky',
                        top: '140px',
                        height: 'fit-content'
                    }}>
                        <h2 style={{ 
                            fontSize: '1.5rem', 
                            marginBottom: '1.5rem',
                            color: 'var(--primary)',
                            textAlign: 'center'
                        }}>
                            <i className="fas fa-receipt"></i> Order Summary
                        </h2>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '1rem',
                            color: 'var(--text)'
                        }}>
                            <span>Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} items):</span>
                            <span style={{ fontWeight: 'bold' }}>${totalPrice.toFixed(2)}</span>
                        </div>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '1rem',
                            color: 'var(--text)'
                        }}>
                            <span>Shipping:</span>
                            <span style={{ fontWeight: 'bold', color: '#28a745' }}>FREE</span>
                        </div>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '1rem',
                            color: 'var(--text)'
                        }}>
                            <span>Tax:</span>
                            <span style={{ fontWeight: 'bold' }}>$0.00</span>
                        </div>
                        
                        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '2px solid var(--primary)' }} />
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            fontSize: '1.5rem', 
                            fontWeight: 'bold', 
                            color: 'var(--primary)',
                            marginBottom: '2rem'
                        }}>
                            <span>Total:</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>

                        <button 
                            onClick={onProceedToBuy}
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(34, 139, 34, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <i className="fas fa-lock"></i> Proceed to Checkout
                        </button>

                        <p style={{ 
                            marginTop: '1rem', 
                            fontSize: '0.85rem', 
                            textAlign: 'center',
                            color: 'var(--text-light)',
                            margin: '1rem 0 0 0'
                        }}>
                            <i className="fas fa-shield-alt"></i> Secure checkout with blockchain verification
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}