import React, { useState, useEffect } from 'react';

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('all'); // all, ethereum, hedera
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        // Load transactions from localStorage
        const savedTransactions = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
        setTransactions(savedTransactions);
    }, []);

    const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'all') return true;
        return transaction.network.toLowerCase().includes(filter.toLowerCase());
    });

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const formatAmount = (amount) => {
        return `$${amount.toFixed(2)}`;
    };

    const getNetworkIcon = (network) => {
        if (network.toLowerCase().includes('ethereum')) return '🔗';
        if (network.toLowerCase().includes('hedera')) return '⚡';
        return '💰';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#28a745';
            case 'pending': return '#ffc107';
            case 'failed': return '#dc3545';
            default: return '#6c757d';
        }
    };

    if (transactions.length === 0) {
        return (
            <div style={{ 
                padding: '4rem 2rem', 
                textAlign: 'center',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#2c1810' }}>
                    Transaction History
                </h1>
                <div style={{
                    background: '#f8f9fa',
                    padding: '3rem',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef'
                }}>
                    <h3 style={{ color: '#6c757d', marginBottom: '1rem' }}>No transactions yet</h3>
                    <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
                        Complete your first coffee purchase to see transaction history here!
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
                        Browse Coffee Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#2c1810' }}>
                Transaction History
            </h1>
            
            <p style={{ 
                textAlign: 'center', 
                color: '#28a745', 
                marginBottom: '2rem',
                fontSize: '0.9rem'
            }}>
                💾 All transactions are automatically saved to your browser
            </p>

            {/* Filter Section */}
            <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '10px',
                marginBottom: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginBottom: '1rem', color: '#2c1810' }}>Filter Transactions</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setFilter('all')}
                        style={{
                            background: filter === 'all' ? '#8B4513' : '#f8f9fa',
                            color: filter === 'all' ? 'white' : '#2c1810',
                            padding: '0.5rem 1rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        All ({transactions.length})
                    </button>
                    <button
                        onClick={() => setFilter('ethereum')}
                        style={{
                            background: filter === 'ethereum' ? '#8B4513' : '#f8f9fa',
                            color: filter === 'ethereum' ? 'white' : '#2c1810',
                            padding: '0.5rem 1rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        🔗 Ethereum ({transactions.filter(t => t.network.toLowerCase().includes('ethereum')).length})
                    </button>
                    <button
                        onClick={() => setFilter('hedera')}
                        style={{
                            background: filter === 'hedera' ? '#8B4513' : '#f8f9fa',
                            color: filter === 'hedera' ? 'white' : '#2c1810',
                            padding: '0.5rem 1rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        ⚡ Hedera ({transactions.filter(t => t.network.toLowerCase().includes('hedera')).length})
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredTransactions.map((transaction, index) => (
                    <div key={transaction.id} style={{
                        background: index === 0 ? '#f8f9fa' : 'white',
                        padding: '1.5rem',
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        border: index === 0 ? '2px solid #28a745' : '1px solid #e9ecef',
                        position: 'relative'
                    }}>
                        {index === 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '20px',
                                background: '#28a745',
                                color: 'white',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                ✨ NEWEST
                            </div>
                        )}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto auto',
                            gap: '1rem',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ fontSize: '1.5rem' }}>
                                {getNetworkIcon(transaction.network)}
                            </div>
                            
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c1810' }}>
                                    {transaction.network} Payment
                                </h3>
                                <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                                    {formatDate(transaction.timestamp)}
                                </p>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ 
                                    fontSize: '1.2rem', 
                                    fontWeight: 'bold', 
                                    color: '#8B4513' 
                                }}>
                                    {formatAmount(transaction.amount)}
                                </div>
                                <div style={{
                                    color: getStatusColor(transaction.status),
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold'
                                }}>
                                    {transaction.status.toUpperCase()}
                                </div>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ 
                                    fontSize: '0.8rem', 
                                    color: '#666',
                                    wordBreak: 'break-all'
                                }}>
                                    {transaction.hash}
                                </div>
                            </div>
                        </div>

                        {/* Transaction Items */}
                        <div style={{
                            background: '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '5px',
                            marginTop: '1rem'
                        }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c1810' }}>Items Purchased:</h4>
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                {transaction.items.map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.5rem',
                                        background: 'white',
                                        borderRadius: '3px'
                                    }}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span style={{ fontWeight: 'bold' }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div style={{
                background: '#f8f9fa',
                padding: '2rem',
                borderRadius: '10px',
                marginTop: '2rem',
                textAlign: 'center'
            }}>
                <h3 style={{ color: '#2c1810', marginBottom: '1rem' }}>Transaction Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B4513' }}>
                            {transactions.length}
                        </div>
                        <div style={{ color: '#666' }}>Total Transactions</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B4513' }}>
                            ${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                        </div>
                        <div style={{ color: '#666' }}>Total Spent</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B4513' }}>
                            {transactions.filter(t => t.status === 'completed').length}
                        </div>
                        <div style={{ color: '#666' }}>Completed</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
