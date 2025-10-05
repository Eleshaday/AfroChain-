import React, { useState, useEffect } from 'react';

export default function SmartEscrow({ onBack }) {
    const [escrowId, setEscrowId] = useState('');
    const [farmerAddress, setFarmerAddress] = useState('');
    const [arbiterAddress, setArbiterAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [coffeeBatchId, setCoffeeBatchId] = useState('');
    const [description, setDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [escrowResult, setEscrowResult] = useState(null);

    // Mock escrow data for demonstration
    const [escrows, setEscrows] = useState([
        {
            id: 1,
            buyer: '0x742d35Cc6634C0532925a3b8D0C0C1C0C0C0C0C0',
            farmer: '0x1234567890123456789012345678901234567890',
            arbiter: '0x9876543210987654321098765432109876543210',
            amount: '0.5',
            coffeeBatchId: 'BATCH-SIDAMA-2024-001',
            description: 'Sidama Grade 1 Green Beans - 10 lbs',
            status: 'active',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            autoRefundTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            disputed: false
        },
        {
            id: 2,
            buyer: '0x742d35Cc6634C0532925a3b8D0C0C1C0C0C0C0C0',
            farmer: '0x2345678901234567890123456789012345678901',
            arbiter: '0x8765432109876543210987654321098765432109',
            amount: '0.8',
            coffeeBatchId: 'BATCH-YIRGA-2024-002',
            description: 'Yirgacheffe Grade 2 Green Beans - 15 lbs',
            status: 'disputed',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            autoRefundTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            disputed: true,
            disputeReason: 'Coffee quality not as described'
        }
    ]);

    const handleCreateEscrow = async () => {
        if (!farmerAddress || !arbiterAddress || !amount || !coffeeBatchId) {
            alert('Please fill in all required fields');
            return;
        }

        setIsCreating(true);
        setEscrowResult(null);

        try {
            // Simulate API call to create escrow
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const newEscrow = {
                id: escrows.length + 1,
                buyer: '0x742d35Cc6634C0532925a3b8D0C0C1C0C0C0C0C0',
                farmer: farmerAddress,
                arbiter: arbiterAddress,
                amount: amount,
                coffeeBatchId: coffeeBatchId,
                description: description || 'Coffee purchase',
                status: 'active',
                createdAt: new Date().toISOString(),
                autoRefundTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                disputed: false
            };

            setEscrows([newEscrow, ...escrows]);
            setEscrowResult({
                success: true,
                escrowId: newEscrow.id,
                message: 'Escrow created successfully!'
            });

            // Reset form
            setFarmerAddress('');
            setArbiterAddress('');
            setAmount('');
            setCoffeeBatchId('');
            setDescription('');
        } catch (error) {
            setEscrowResult({
                success: false,
                error: 'Failed to create escrow'
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleApproveDelivery = async (escrowId) => {
        try {
            // Simulate approval
            setEscrows(escrows.map(escrow => 
                escrow.id === escrowId 
                    ? { ...escrow, status: 'completed' }
                    : escrow
            ));
            
            alert('Delivery approved! Payment released to farmer.');
        } catch (error) {
            alert('Failed to approve delivery');
        }
    };

    const handleRaiseDispute = async (escrowId) => {
        const reason = prompt('Please provide a reason for the dispute:');
        if (reason) {
            try {
                setEscrows(escrows.map(escrow => 
                    escrow.id === escrowId 
                        ? { ...escrow, status: 'disputed', disputed: true, disputeReason: reason }
                        : escrow
                ));
                
                alert('Dispute raised successfully!');
            } catch (error) {
                alert('Failed to raise dispute');
            }
        }
    };

    const handleAutoRefund = async (escrowId) => {
        try {
            setEscrows(escrows.map(escrow => 
                escrow.id === escrowId 
                    ? { ...escrow, status: 'refunded' }
                    : escrow
            ));
            
            alert('Auto-refund executed! Payment returned to buyer.');
        } catch (error) {
            alert('Failed to execute auto-refund');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#28a745';
            case 'disputed': return '#ffc107';
            case 'completed': return '#17a2b8';
            case 'refunded': return '#6c757d';
            default: return '#6c757d';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return '⏳';
            case 'disputed': return '⚠️';
            case 'completed': return '✅';
            case 'refunded': return '💰';
            default: return '❓';
        }
    };

    const formatTimeRemaining = (autoRefundTime) => {
        const now = new Date();
        const refundTime = new Date(autoRefundTime);
        const diff = refundTime - now;
        
        if (diff <= 0) return 'Auto-refund available';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        return `${days}d ${hours}h remaining`;
    };

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
                    🤝 Smart Escrow System
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

            {/* Create Escrow Form */}
            <div style={{
                background: 'var(--background-color)',
                padding: '2rem',
                borderRadius: 'var(--border-radius)',
                marginBottom: '2rem',
                border: '1px solid var(--border-color)'
            }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Create New Escrow</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                        }}>
                            Farmer Address
                        </label>
                        <input
                            type="text"
                            value={farmerAddress}
                            onChange={(e) => setFarmerAddress(e.target.value)}
                            placeholder="0x..."
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

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                        }}>
                            Arbiter Address
                        </label>
                        <input
                            type="text"
                            value={arbiterAddress}
                            onChange={(e) => setArbiterAddress(e.target.value)}
                            placeholder="0x..."
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

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                        }}>
                            Amount (ETH)
                        </label>
                        <input
                            type="number"
                            step="0.001"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.5"
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

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                        }}>
                            Coffee Batch ID
                        </label>
                        <input
                            type="text"
                            value={coffeeBatchId}
                            onChange={(e) => setCoffeeBatchId(e.target.value)}
                            placeholder="BATCH-SIDAMA-2024-001"
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

                <div style={{ marginTop: '1rem' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                    }}>
                        Description (Optional)
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the coffee being purchased..."
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--border-radius)',
                            fontSize: '1rem',
                            background: 'var(--card-background)',
                            color: 'var(--text-primary)',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button
                    onClick={handleCreateEscrow}
                    disabled={isCreating}
                    style={{
                        width: '100%',
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: isCreating ? '#6c757d' : 'var(--gradient-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: isCreating ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isCreating ? '🔄 Creating Escrow...' : '🤝 Create Escrow'}
                </button>

                {escrowResult && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        borderRadius: 'var(--border-radius)',
                        border: `2px solid ${escrowResult.success ? 'var(--success-color)' : 'var(--error-color)'}`,
                        background: escrowResult.success ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'
                    }}>
                        {escrowResult.success ? (
                            <div style={{ color: '#155724' }}>
                                ✅ {escrowResult.message}
                            </div>
                        ) : (
                            <div style={{ color: '#721c24' }}>
                                ❌ {escrowResult.error}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Active Escrows */}
            <div>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Active Escrows</h3>
                
                {escrows.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: 'var(--text-secondary)'
                    }}>
                        <p>No active escrows found.</p>
                        <p>Create your first escrow above to get started.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {escrows.map((escrow) => (
                            <div key={escrow.id} style={{
                                background: 'var(--background-color)',
                                padding: '1.5rem',
                                borderRadius: 'var(--border-radius)',
                                border: '1px solid var(--border-color)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem'
                                }}>
                                    <div>
                                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>
                                            Escrow #{escrow.id}
                                        </h4>
                                        <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                                            {escrow.description}
                                        </p>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            Batch ID: <code>{escrow.coffeeBatchId}</code>
                                        </p>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: getStatusColor(escrow.status),
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>
                                        <span>{getStatusIcon(escrow.status)}</span>
                                        {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div>
                                        <strong style={{ color: 'var(--text-primary)' }}>Amount:</strong>
                                        <div style={{ color: 'var(--text-secondary)' }}>{escrow.amount} ETH</div>
                                    </div>
                                    <div>
                                        <strong style={{ color: 'var(--text-primary)' }}>Farmer:</strong>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                                            {escrow.farmer.slice(0, 6)}...{escrow.farmer.slice(-4)}
                                        </div>
                                    </div>
                                    <div>
                                        <strong style={{ color: 'var(--text-primary)' }}>Arbiter:</strong>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                                            {escrow.arbiter.slice(0, 6)}...{escrow.arbiter.slice(-4)}
                                        </div>
                                    </div>
                                    <div>
                                        <strong style={{ color: 'var(--text-primary)' }}>Auto-refund:</strong>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            {formatTimeRemaining(escrow.autoRefundTime)}
                                        </div>
                                    </div>
                                </div>

                                {escrow.disputed && (
                                    <div style={{
                                        background: 'rgba(255, 193, 7, 0.1)',
                                        padding: '1rem',
                                        borderRadius: 'var(--border-radius)',
                                        marginBottom: '1rem',
                                        border: '1px solid rgba(255, 193, 7, 0.3)'
                                    }}>
                                        <div style={{ color: '#856404', fontWeight: '600', marginBottom: '0.5rem' }}>
                                            ⚠️ Dispute Raised
                                        </div>
                                        <div style={{ color: '#856404', fontSize: '0.9rem' }}>
                                            Reason: {escrow.disputeReason}
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {escrow.status === 'active' && (
                                        <>
                                            <button
                                                onClick={() => handleApproveDelivery(escrow.id)}
                                                style={{
                                                    background: 'var(--success-color)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.75rem 1.5rem',
                                                    borderRadius: 'var(--border-radius)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                ✅ Approve Delivery
                                            </button>
                                            <button
                                                onClick={() => handleRaiseDispute(escrow.id)}
                                                style={{
                                                    background: 'var(--warning-color)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.75rem 1.5rem',
                                                    borderRadius: 'var(--border-radius)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                ⚠️ Raise Dispute
                                            </button>
                                        </>
                                    )}
                                    
                                    {formatTimeRemaining(escrow.autoRefundTime) === 'Auto-refund available' && escrow.status === 'active' && (
                                        <button
                                            onClick={() => handleAutoRefund(escrow.id)}
                                            style={{
                                                background: '#17a2b8',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: 'var(--border-radius)',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            💰 Auto-Refund
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Smart Escrow Features */}
            <div style={{
                marginTop: '2rem',
                background: 'rgba(40, 167, 69, 0.1)',
                padding: '1.5rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid rgba(40, 167, 69, 0.3)'
            }}>
                <h4 style={{ color: '#155724', marginBottom: '1rem' }}>🛡️ Smart Escrow Features</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                        <strong style={{ color: '#155724' }}>Auto-Refund Protection</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Automatic refund after 7 days if delivery is not approved
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Dispute Resolution</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Neutral arbiter resolves disputes with 5% arbitration fee
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Transparent Process</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            All transactions recorded on blockchain for transparency
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Fair Trade</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Ensures fair payment to farmers while protecting buyers
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
