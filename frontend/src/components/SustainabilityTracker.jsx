import React, { useState, useEffect } from 'react';

export default function SustainabilityTracker({ onBack }) {
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mock sustainability data
    const [sustainabilityData, setSustainabilityData] = useState([
        {
            id: 1,
            batchId: 'BATCH-SIDAMA-2024-001',
            coffeeName: 'Sidama Grade 1 Green Beans',
            farmName: 'Sidama Coffee Farmers Cooperative Union',
            location: 'Sidama Region, Ethiopia',
            harvestDate: '2024-01-15',
            sustainabilityScore: 92,
            carbonFootprint: {
                total: 2.3, // kg CO2 per kg coffee
                farming: 1.2,
                processing: 0.8,
                transport: 0.3
            },
            waterUsage: {
                total: 8500, // liters per kg
                irrigation: 6500,
                processing: 1500,
                cleaning: 500
            },
            biodiversity: {
                score: 88,
                shadeGrown: true,
                nativeSpecies: 45,
                protectedArea: true
            },
            socialImpact: {
                fairTrade: true,
                communitySupport: 85,
                womenEmpowerment: 78,
                educationPrograms: true
            },
            certifications: ['Fair Trade Certified', 'Organic Certified', 'Rainforest Alliance'],
            impactMetrics: {
                treesPlanted: 125,
                jobsCreated: 15,
                familiesSupported: 8,
                carbonOffset: 1250
            }
        },
        {
            id: 2,
            batchId: 'BATCH-YIRGA-2024-002',
            coffeeName: 'Yirgacheffe Grade 2 Green Beans',
            farmName: 'Yirgacheffe Coffee Farmers Union',
            location: 'Yirgacheffe, Ethiopia',
            harvestDate: '2024-02-10',
            sustainabilityScore: 89,
            carbonFootprint: {
                total: 2.1,
                farming: 1.0,
                processing: 0.7,
                transport: 0.4
            },
            waterUsage: {
                total: 7800,
                irrigation: 5800,
                processing: 1400,
                cleaning: 600
            },
            biodiversity: {
                score: 91,
                shadeGrown: true,
                nativeSpecies: 52,
                protectedArea: true
            },
            socialImpact: {
                fairTrade: true,
                communitySupport: 82,
                womenEmpowerment: 85,
                educationPrograms: true
            },
            certifications: ['Organic Certified', 'Direct Trade'],
            impactMetrics: {
                treesPlanted: 98,
                jobsCreated: 12,
                familiesSupported: 6,
                carbonOffset: 890
            }
        },
        {
            id: 3,
            batchId: 'BATCH-HARRAR-2024-003',
            coffeeName: 'Harrar Longberry Green Beans',
            farmName: 'Harrar Coffee Cooperative',
            location: 'Harrar Region, Ethiopia',
            harvestDate: '2024-01-25',
            sustainabilityScore: 78,
            carbonFootprint: {
                total: 2.8,
                farming: 1.4,
                processing: 1.0,
                transport: 0.4
            },
            waterUsage: {
                total: 9200,
                irrigation: 7200,
                processing: 1600,
                cleaning: 400
            },
            biodiversity: {
                score: 72,
                shadeGrown: false,
                nativeSpecies: 28,
                protectedArea: false
            },
            socialImpact: {
                fairTrade: false,
                communitySupport: 65,
                womenEmpowerment: 60,
                educationPrograms: false
            },
            certifications: ['Direct Trade', 'Traditional Methods'],
            impactMetrics: {
                treesPlanted: 45,
                jobsCreated: 8,
                familiesSupported: 4,
                carbonOffset: 456
            }
        }
    ]);

    const handleViewBatch = (batch) => {
        setSelectedBatch(batch);
    };

    const handleCloseBatchDetail = () => {
        setSelectedBatch(null);
    };

    const getScoreColor = (score) => {
        if (score >= 90) return '#28a745';
        if (score >= 80) return '#17a2b8';
        if (score >= 70) return '#ffc107';
        return '#dc3545';
    };

    const getScoreIcon = (score) => {
        if (score >= 90) return '🌱';
        if (score >= 80) return '🌿';
        if (score >= 70) return '🍃';
        return '🌳';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (selectedBatch) {
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
                        🌱 Sustainability Impact Report
                    </h2>
                    <button
                        onClick={handleCloseBatchDetail}
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

                {/* Batch Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                        {selectedBatch.coffeeName}
                    </h1>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', opacity: 0.9 }}>
                        {selectedBatch.farmName} • {selectedBatch.location}
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
                            <span>{getScoreIcon(selectedBatch.sustainabilityScore)}</span>
                            {selectedBatch.sustainabilityScore}/100 Sustainability Score
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px'
                        }}>
                            <span>📅</span>
                            Harvested {formatDate(selectedBatch.harvestDate)}
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px'
                        }}>
                            <span>🏷️</span>
                            {selectedBatch.batchId}
                        </div>
                    </div>
                </div>

                {/* Environmental Impact */}
                <div style={{
                    background: 'var(--background-color)',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>🌍 Environmental Impact</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Carbon Footprint */}
                        <div>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Carbon Footprint</h4>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span>Total CO₂ Emissions</span>
                                    <span style={{ fontWeight: '600' }}>{selectedBatch.carbonFootprint.total} kg CO₂/kg</span>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    background: 'var(--border-color)',
                                    borderRadius: '4px'
                                }}>
                                    <div style={{
                                        width: `${(selectedBatch.carbonFootprint.total / 5) * 100}%`,
                                        height: '100%',
                                        background: 'var(--error-color)',
                                        borderRadius: '4px'
                                    }}></div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Farming</span>
                                    <span style={{ fontSize: '0.9rem' }}>{selectedBatch.carbonFootprint.farming} kg</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Processing</span>
                                    <span style={{ fontSize: '0.9rem' }}>{selectedBatch.carbonFootprint.processing} kg</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Transport</span>
                                    <span style={{ fontSize: '0.9rem' }}>{selectedBatch.carbonFootprint.transport} kg</span>
                                </div>
                            </div>
                        </div>

                        {/* Water Usage */}
                        <div>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Water Usage</h4>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span>Total Water Used</span>
                                    <span style={{ fontWeight: '600' }}>{selectedBatch.waterUsage.total.toLocaleString()} L/kg</span>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    background: 'var(--border-color)',
                                    borderRadius: '4px'
                                }}>
                                    <div style={{
                                        width: `${(selectedBatch.waterUsage.total / 15000) * 100}%`,
                                        height: '100%',
                                        background: '#17a2b8',
                                        borderRadius: '4px'
                                    }}></div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Irrigation</span>
                                    <span style={{ fontSize: '0.9rem' }}>{selectedBatch.waterUsage.irrigation.toLocaleString()} L</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Processing</span>
                                    <span style={{ fontSize: '0.9rem' }}>{selectedBatch.waterUsage.processing.toLocaleString()} L</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Cleaning</span>
                                    <span style={{ fontSize: '0.9rem' }}>{selectedBatch.waterUsage.cleaning.toLocaleString()} L</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Biodiversity & Social Impact */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Biodiversity */}
                    <div style={{
                        background: 'var(--background-color)',
                        padding: '1.5rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>🦋 Biodiversity</h3>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem'
                            }}>
                                <span>Biodiversity Score</span>
                                <span style={{ fontWeight: '600', color: getScoreColor(selectedBatch.biodiversity.score) }}>
                                    {selectedBatch.biodiversity.score}/100
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: 'var(--border-color)',
                                borderRadius: '4px'
                            }}>
                                <div style={{
                                    width: `${selectedBatch.biodiversity.score}%`,
                                    height: '100%',
                                    background: getScoreColor(selectedBatch.biodiversity.score),
                                    borderRadius: '4px'
                                }}></div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Shade Grown</span>
                                <span style={{ color: selectedBatch.biodiversity.shadeGrown ? 'var(--success-color)' : 'var(--error-color)' }}>
                                    {selectedBatch.biodiversity.shadeGrown ? '✅ Yes' : '❌ No'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Native Species</span>
                                <span>{selectedBatch.biodiversity.nativeSpecies} species</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Protected Area</span>
                                <span style={{ color: selectedBatch.biodiversity.protectedArea ? 'var(--success-color)' : 'var(--error-color)' }}>
                                    {selectedBatch.biodiversity.protectedArea ? '✅ Yes' : '❌ No'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Social Impact */}
                    <div style={{
                        background: 'var(--background-color)',
                        padding: '1.5rem',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>👥 Social Impact</h3>
                        
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span>Community Support</span>
                                    <span style={{ fontWeight: '600' }}>{selectedBatch.socialImpact.communitySupport}%</span>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '6px',
                                    background: 'var(--border-color)',
                                    borderRadius: '3px'
                                }}>
                                    <div style={{
                                        width: `${selectedBatch.socialImpact.communitySupport}%`,
                                        height: '100%',
                                        background: 'var(--success-color)',
                                        borderRadius: '3px'
                                    }}></div>
                                </div>
                            </div>
                            
                            <div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span>Women Empowerment</span>
                                    <span style={{ fontWeight: '600' }}>{selectedBatch.socialImpact.womenEmpowerment}%</span>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '6px',
                                    background: 'var(--border-color)',
                                    borderRadius: '3px'
                                }}>
                                    <div style={{
                                        width: `${selectedBatch.socialImpact.womenEmpowerment}%`,
                                        height: '100%',
                                        background: '#e83e8c',
                                        borderRadius: '3px'
                                    }}></div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Fair Trade</span>
                                    <span style={{ color: selectedBatch.socialImpact.fairTrade ? 'var(--success-color)' : 'var(--error-color)' }}>
                                        {selectedBatch.socialImpact.fairTrade ? '✅ Yes' : '❌ No'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Education Programs</span>
                                    <span style={{ color: selectedBatch.socialImpact.educationPrograms ? 'var(--success-color)' : 'var(--error-color)' }}>
                                        {selectedBatch.socialImpact.educationPrograms ? '✅ Yes' : '❌ No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Impact Metrics */}
                <div style={{
                    background: 'var(--background-color)',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>📊 Impact Metrics</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                                {selectedBatch.impactMetrics.treesPlanted}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>🌳 Trees Planted</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                {selectedBatch.impactMetrics.jobsCreated}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>💼 Jobs Created</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>
                                {selectedBatch.impactMetrics.familiesSupported}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>👨‍👩‍👧‍👦 Families Supported</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>
                                {selectedBatch.impactMetrics.carbonOffset}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>🌱 CO₂ Offset (kg)</div>
                        </div>
                    </div>
                </div>

                {/* Certifications */}
                <div style={{
                    background: 'var(--background-color)',
                    padding: '2rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>🏆 Certifications</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedBatch.certifications.map((cert, index) => (
                            <span key={index} style={{
                                background: 'var(--success-color)',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '25px',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}>
                                {cert}
                            </span>
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
                    🌱 Sustainability Impact Tracker
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

            {/* Overview Stats */}
            <div style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: 'var(--border-radius)',
                marginBottom: '2rem'
            }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>🌍 Overall Impact</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>2,595</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Trees Planted</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>35</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Jobs Created</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>18</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Families Supported</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>2,596</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>kg CO₂ Offset</div>
                    </div>
                </div>
            </div>

            {/* Coffee Batches */}
            <div>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>☕ Coffee Batch Impact Reports</h3>
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {sustainabilityData.map((batch) => (
                        <div key={batch.id} style={{
                            background: 'var(--card-background)',
                            padding: '1.5rem',
                            borderRadius: 'var(--border-radius)',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                        }}
                        onClick={() => handleViewBatch(batch)}
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
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '1rem'
                            }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                                        {batch.coffeeName}
                                    </h4>
                                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>
                                        {batch.farmName} • {batch.location}
                                    </p>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        Harvested {formatDate(batch.harvestDate)}
                                    </p>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: getScoreColor(batch.sustainabilityScore),
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                }}>
                                    <span>{getScoreIcon(batch.sustainabilityScore)}</span>
                                    {batch.sustainabilityScore}/100
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--error-color)' }}>
                                        {batch.carbonFootprint.total} kg
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>CO₂ per kg</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#17a2b8' }}>
                                        {batch.waterUsage.total.toLocaleString()} L
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Water per kg</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                                        {batch.biodiversity.score}/100
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Biodiversity</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>
                                        {batch.impactMetrics.carbonOffset} kg
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>CO₂ Offset</div>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                marginBottom: '1rem'
                            }}>
                                {batch.certifications.slice(0, 2).map((cert, index) => (
                                    <span key={index} style={{
                                        background: 'var(--success-color)',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                    }}>
                                        {cert}
                                    </span>
                                ))}
                                {batch.certifications.length > 2 && (
                                    <span style={{
                                        background: 'var(--background-color)',
                                        color: 'var(--text-secondary)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem'
                                    }}>
                                        +{batch.certifications.length - 2} more
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
                                🌱 View Impact Report
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sustainability Benefits */}
            <div style={{
                marginTop: '2rem',
                background: 'rgba(40, 167, 69, 0.1)',
                padding: '1.5rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid rgba(40, 167, 69, 0.3)'
            }}>
                <h4 style={{ color: '#155724', marginBottom: '1rem' }}>🌱 Sustainability Tracking Benefits</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                        <strong style={{ color: '#155724' }}>Environmental Transparency</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Track carbon footprint, water usage, and biodiversity impact
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Social Impact Measurement</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Monitor community support, fair trade practices, and empowerment
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Certification Tracking</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Verify and display sustainability certifications
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#155724' }}>Impact Reporting</strong>
                        <p style={{ color: '#155724', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                            Generate detailed reports for ethical buyers and consumers
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
