import React, { useState, useEffect } from 'react';

export default function FarmerReputation({ onBack }) {
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Mock farmer data with reputation scores
    const [farmers, setFarmers] = useState([
        {
            id: 1,
            did: 'did:hedera:mainnet:7Prd74ry1Uct87nZqL3ny7aR7Cg46jvXq3JmzReK6',
            name: 'Sidama Coffee Farmers Cooperative Union',
            location: 'Sidama Region, Ethiopia',
            reputationScore: 95,
            level: 'Platinum',
            verified: true,
            joinDate: '2020-03-15',
            totalSales: 1250,
            totalRevenue: 156250,
            avgRating: 4.8,
            totalReviews: 342,
            certifications: ['Fair Trade Certified', 'Organic Certified', 'Rainforest Alliance'],
            specialties: ['Sidama Grade 1', 'Natural Process', 'High Altitude'],
            profileImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
            recentTransactions: [
                { id: 1, buyer: 'Coffee Roaster Co.', amount: 2500, rating: 5, date: '2024-01-15' },
                { id: 2, buyer: 'Artisan Coffee LLC', amount: 1800, rating: 5, date: '2024-01-10' },
                { id: 3, buyer: 'Direct Trade Partners', amount: 3200, rating: 4, date: '2024-01-05' }
            ],
            sustainabilityScore: 92,
            carbonOffset: 1250,
            waterSaved: 8500
        },
        {
            id: 2,
            did: 'did:hedera:mainnet:8Qsd85sy2Vct98oZrM4oz8bS8Dh57kwYr4KnzSeL7',
            name: 'Yirgacheffe Coffee Farmers Union',
            location: 'Yirgacheffe, Ethiopia',
            reputationScore: 88,
            level: 'Gold',
            verified: true,
            joinDate: '2021-06-20',
            totalSales: 890,
            totalRevenue: 133500,
            avgRating: 4.6,
            totalReviews: 198,
            certifications: ['Organic Certified', 'Direct Trade'],
            specialties: ['Yirgacheffe Grade 2', 'Wet Process', 'Citrus Notes'],
            profileImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
            recentTransactions: [
                { id: 1, buyer: 'Premium Coffee Co.', amount: 2200, rating: 5, date: '2024-01-12' },
                { id: 2, buyer: 'Specialty Roasters', amount: 1500, rating: 4, date: '2024-01-08' }
            ],
            sustainabilityScore: 89,
            carbonOffset: 890,
            waterSaved: 6200
        },
        {
            id: 3,
            did: 'did:hedera:mainnet:9Rte96tz3Wdu09pZsN5pa9cT9Ei68lxZs5LozTeM8',
            name: 'Harrar Coffee Cooperative',
            location: 'Harrar Region, Ethiopia',
            reputationScore: 82,
            level: 'Silver',
            verified: true,
            joinDate: '2022-01-10',
            totalSales: 456,
            totalRevenue: 68400,
            avgRating: 4.4,
            totalReviews: 87,
            certifications: ['Direct Trade', 'Traditional Methods'],
            specialties: ['Harrar Longberry', 'Natural Process', 'Blueberry Notes'],
            profileImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
            recentTransactions: [
                { id: 1, buyer: 'Blueberry Coffee Co.', amount: 1200, rating: 4, date: '2024-01-14' },
                { id: 2, buyer: 'Traditional Roasters', amount: 800, rating: 5, date: '2024-01-09' }
            ],
            sustainabilityScore: 78,
            carbonOffset: 456,
            waterSaved: 3200
        },
        {
            id: 4,
            did: 'did:hedera:mainnet:0Suf07ua4Xev10qaTO6qb0dU0Fj79myYt6MpaUfN9',
            name: 'Guji Coffee Farmers Association',
            location: 'Guji Zone, Ethiopia',
            reputationScore: 96,
            level: 'Platinum',
            verified: true,
            joinDate: '2019-09-05',
            totalSales: 2100,
            totalRevenue: 420000,
            avgRating: 4.9,
            totalReviews: 567,
            certifications: ['Rainforest Alliance', 'Award Winning', 'Premium Grade'],
            specialties: ['Guji Natural', 'Complex Fruit Notes', 'Award Winner'],
            profileImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
            recentTransactions: [
                { id: 1, buyer: 'Award Coffee Co.', amount: 4500, rating: 5, date: '2024-01-16' },
                { id: 2, buyer: 'Premium Partners', amount: 3800, rating: 5, date: '2024-01-11' },
                { id: 3, buyer: 'International Buyers', amount: 5200, rating: 5, date: '2024-01-06' }
            ],
            sustainabilityScore: 94,
            carbonOffset: 2100,
            waterSaved: 15000
        }
    ]);

    const filteredFarmers = farmers.filter(farmer =>
        farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

    const getReputationColor = (score) => {
        if (score >= 90) return '#28a745';
        if (score >= 80) return '#17a2b8';
        if (score >= 70) return '#ffc107';
        return '#dc3545';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleViewFarmer = (farmer) => {
        setSelectedFarmer(farmer);
    };

    const handleCloseFarmerDetail = () => {
        setSelectedFarmer(null);
    };

    if (selectedFarmer) {
        return (
            <div style={{
                background: 'var(--card-background)',
                padding: '2rem',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow-light)',
                border: '1px solid var(--border-color)',
                maxWidth: '1000px',
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
                        👤 Farmer Profile
                    </h2>
                    <button
                        onClick={handleCloseFarmerDetail}
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
                        ← Back to List
                    </button>
                </div>

                {/* Farmer Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem',
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'center'
                }}>
                    <img
                        src={selectedFarmer.profileImage}
                        alt={selectedFarmer.name}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '4px solid white'
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                            {selectedFarmer.name}
                        </h1>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', opacity: 0.9 }}>
                            📍 {selectedFarmer.location}
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(255,255,255,0.2)',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px'
                            }}>
                                <span>{getLevelIcon(selectedFarmer.level)}</span>
                                {selectedFarmer.level}
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(255,255,255,0.2)',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px'
                            }}>
                                <span>⭐</span>
                                {selectedFarmer.avgRating}/5.0 ({selectedFarmer.totalReviews} reviews)
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(255,255,255,0.2)',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px'
                            }}>
                                <span>🏆</span>
                                {selectedFarmer.reputationScore}/100
                            </div>
                        </div>
                    </div>
                </div>

                {/* DID and Verification */}
                <div style={{
                    background: 'var(--background-color)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>🔐 Identity Verification</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        <div>
                            <strong style={{ color: 'var(--text-primary)' }}>Decentralized ID (DID):</strong>
                            <div style={{
                                color: 'var(--text-secondary)',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                marginTop: '0.5rem',
                                wordBreak: 'break-all'
                            }}>
                                {selectedFarmer.did}
                            </div>
                        </div>
                        <div>
                            <strong style={{ color: 'var(--text-primary)' }}>Verification Status:</strong>
                            <div style={{
                                color: 'var(--success-color)',
                                fontWeight: '600',
                                marginTop: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                ✅ Verified on Hedera Network
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        background: 'var(--background-color)',
                        padding: '1.5rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            {selectedFarmer.totalSales}
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>Total Sales</div>
                    </div>
                    <div style={{
                        background: 'var(--background-color)',
                        padding: '1.5rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            ${selectedFarmer.totalRevenue.toLocaleString()}
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>Total Revenue</div>
                    </div>
                    <div style={{
                        background: 'var(--background-color)',
                        padding: '1.5rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            {selectedFarmer.sustainabilityScore}%
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>Sustainability Score</div>
                    </div>
                    <div style={{
                        background: 'var(--background-color)',
                        padding: '1.5rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            {selectedFarmer.carbonOffset}
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>CO₂ Offset (kg)</div>
                    </div>
                </div>

                {/* Certifications and Specialties */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        background: 'var(--background-color)',
                        padding: '1.5rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>🏆 Certifications</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {selectedFarmer.certifications.map((cert, index) => (
                                <span key={index} style={{
                                    background: 'var(--success-color)',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                }}>
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'var(--background-color)',
                        padding: '1.5rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>☕ Specialties</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {selectedFarmer.specialties.map((specialty, index) => (
                                <span key={index} style={{
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                }}>
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div style={{
                    background: 'var(--background-color)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>📊 Recent Transactions</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {selectedFarmer.recentTransactions.map((transaction) => (
                            <div key={transaction.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'var(--card-background)',
                                borderRadius: 'var(--border-radius)',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                        {transaction.buyer}
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {formatDate(transaction.date)}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                        ${transaction.amount.toLocaleString()}
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {'⭐'.repeat(transaction.rating)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                    👥 Farmer Reputation System
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

            {/* Search */}
            <div style={{
                background: 'var(--background-color)',
                padding: '1.5rem',
                borderRadius: 'var(--border-radius)',
                marginBottom: '2rem',
                border: '1px solid var(--border-color)'
            }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>🔍 Search Farmers</h3>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, location, or specialty..."
                    style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '1rem',
                        background: 'var(--card-background)',
                        color: 'var(--text-primary)'
                    }}
                />
            </div>

            {/* Farmers Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {filteredFarmers.map((farmer) => (
                    <div key={farmer.id} style={{
                        background: 'var(--card-background)',
                        padding: '1.5rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                    }}
                    onClick={() => handleViewFarmer(farmer)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <img
                                src={farmer.profileImage}
                                alt={farmer.name}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                                    {farmer.name}
                                </h3>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    📍 {farmer.location}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    {farmer.reputationScore}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Reputation</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    {farmer.avgRating}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Rating</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    {farmer.totalSales}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Sales</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    {farmer.sustainabilityScore}%
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Sustainability</div>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: getLevelColor(farmer.level),
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                <span>{getLevelIcon(farmer.level)}</span>
                                {farmer.level}
                            </div>
                            <div style={{
                                color: 'var(--success-color)',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>
                                ✅ Verified
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            {farmer.specialties.slice(0, 2).map((specialty, index) => (
                                <span key={index} style={{
                                    background: 'var(--background-color)',
                                    color: 'var(--text-primary)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    {specialty}
                                </span>
                            ))}
                            {farmer.specialties.length > 2 && (
                                <span style={{
                                    background: 'var(--background-color)',
                                    color: 'var(--text-secondary)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem'
                                }}>
                                    +{farmer.specialties.length - 2} more
                                </span>
                            )}
                        </div>

                        <button
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
                            👤 View Profile
                        </button>
                    </div>
                ))}
            </div>

            {filteredFarmers.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: 'var(--text-secondary)'
                }}>
                    <h3>No farmers found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            )}

            {/* DID Benefits */}
            <div style={{
                marginTop: '2rem',
                background: 'rgba(40, 167, 69, 0.1)',
                padding: '1.5rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid rgba(40, 167, 69, 0.3)'
            }}>
                <h4 style={{ color: '#155724', marginBottom: '1rem' }}>🔐 Decentralized Identity Benefits</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                        <strong style={{ color: '#155724' }}>Verifiable Identity</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Each farmer has a unique DID verified on Hedera blockchain
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Reputation Tracking</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Transparent reputation scores based on transaction history
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Trust & Transparency</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Build trust through verified identities and public reputation
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Global Recognition</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Farmers can build global reputation across platforms
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
