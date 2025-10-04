import React from 'react';
import CreateEscrow from './CreateEscrow';
import ArbiterPanel from './ArbiterPanel';
import './HederaBlockchain.css';

const HederaBlockchain = () => {
    return (
        <div className="hedera-page">
            {/* Header */}
            <header className="hedera-header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo-text">
                            <i className="fas fa-coffee logo-icon"></i>
                            Chakka Coffee
                        </div>
                        <div className="hedera-badge">
                            <i className="fas fa-link"></i>
                            Hedera Blockchain Integration
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="hedera-main">
                <div className="container">
                    <div className="hedera-intro">
                        <h1>Blockchain Coffee Transactions</h1>
                        <p>Experience secure, transparent coffee transactions powered by Hedera Hashgraph. This platform enables trustless escrow services for coffee trade between farmers and buyers.</p>
                    </div>
                    
                    <div className="hedera-content">
                        <div className="component-section">
                            <div className="section-header">
                                <h2>Create Escrow Contract</h2>
                                <p>Set up a secure escrow contract for coffee transactions</p>
                            </div>
                            <CreateEscrow />
                        </div>
                        
                        <hr className="section-divider" />
                        
                        <div className="component-section">
                            <div className="section-header">
                                <h2>Arbiter Panel</h2>
                                <p>Manage and resolve escrow disputes</p>
                            </div>
                            <ArbiterPanel />
                        </div>
                    </div>
                    
                    <div className="hedera-info">
                        <div className="info-cards">
                            <div className="info-card">
                                <i className="fas fa-shield-alt"></i>
                                <h3>Secure Transactions</h3>
                                <p>All transactions are secured by Hedera's distributed ledger technology</p>
                            </div>
                            <div className="info-card">
                                <i className="fas fa-handshake"></i>
                                <h3>Trustless Escrow</h3>
                                <p>Smart contracts ensure fair trade without requiring trust between parties</p>
                            </div>
                            <div className="info-card">
                                <i className="fas fa-clock"></i>
                                <h3>Fast Settlement</h3>
                                <p>Near-instant settlement with low transaction costs</p>
                            </div>
                            <div className="info-card">
                                <i className="fas fa-eye"></i>
                                <h3>Transparent</h3>
                                <p>All transactions are publicly verifiable on the blockchain</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HederaBlockchain;
