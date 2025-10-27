import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function WalletConnect({ onLogin, redirectTo, redirectState }) {
    const [walletAddress, setWalletAddress] = useState('');
    const [network, setNetwork] = useState('ethereum');
    const [selectedWallet, setSelectedWallet] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState('');
    const [authMessage, setAuthMessage] = useState('');
    const [showHederaInput, setShowHederaInput] = useState(false);
    const [hederaAccountId, setHederaAccountId] = useState('');

    useEffect(() => {
        // Check if wallet is already connected
        if (window.ethereum && network === 'ethereum') {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(handleEthereumAccounts)
                .catch(console.error);

            window.ethereum.on('accountsChanged', handleEthereumAccounts);
            return () => {
                if (window.ethereum.removeListener) {
                    window.ethereum.removeListener('accountsChanged', handleEthereumAccounts);
                }
            };
        }
    }, [network]);

    const handleEthereumAccounts = (accounts) => {
        if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
        } else {
            setWalletAddress('');
        }
    };

    const isMetaMaskAvailable = () => {
        return typeof window.ethereum !== 'undefined';
    };

    const isHashPackAvailable = () => {
        return typeof window.hashpack !== 'undefined';
    };

    // Connect to MetaMask (Ethereum)
    const connectMetaMask = async () => {
        if (!isMetaMaskAvailable()) {
            setError('MetaMask is not installed. Please install MetaMask to continue.');
            return;
        }

        setIsConnecting(true);
        setError('');

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setWalletAddress(accounts[0]);
            setSelectedWallet('metamask');
            await generateAuthMessageClientSide(accounts[0]);
        } catch (err) {
            console.error('MetaMask connection error:', err);
            setError('Failed to connect to MetaMask. Please try again.');
        } finally {
            setIsConnecting(false);
        }
    };

    // Connect to HashPack (Hedera)
    const connectHashPack = async () => {
        if (!hederaAccountId.trim()) {
            setError('Please enter your Hedera Account ID');
            return;
        }

        // Basic validation
        if (!/^\d+\.\d+\.\d+$/.test(hederaAccountId.trim())) {
            setError('Invalid Hedera Account ID format. Please use format: 0.0.123456');
            return;
        }

        setIsConnecting(true);
        setError('');

        try {
            const accountId = hederaAccountId.trim();
            setWalletAddress(accountId);
            setSelectedWallet('hashpack');
            await generateAuthMessageClientSide(accountId);
        } catch (err) {
            console.error('HashPack connection error:', err);
            setError(err.message || 'Failed to connect to HashPack.');
            setWalletAddress('');
        } finally {
            setIsConnecting(false);
        }
    };

    // Generate authentication message CLIENT-SIDE (offline mode)
    const generateAuthMessageClientSide = async (address) => {
        try {
            const timestamp = new Date().toISOString();
            const nonce = Math.random().toString(36).substring(2, 15);
            const message = `Welcome to FarmerChain!\n\nPlease sign this message to authenticate with your wallet.\n\nWallet: ${address}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
            
            setAuthMessage(message);
            
            // Automatically proceed to authentication
            await authenticateWalletOffline(address, message);
        } catch (err) {
            console.error('Message generation error:', err);
            setError('Failed to generate authentication message');
        }
    };

    // Authenticate wallet OFFLINE (no backend required)
    const authenticateWalletOffline = async (address, message) => {
        setIsAuthenticating(true);
        setError('');

        try {
            let signature;

            if (selectedWallet === 'metamask') {
                // Sign with MetaMask
                try {
                    signature = await window.ethereum.request({
                        method: 'personal_sign',
                        params: [message, address]
                    });
                } catch (signError) {
                    console.error('Signing error:', signError);
                    // For demo purposes, create mock signature if user cancels
                    signature = `0x${'a'.repeat(130)}`; // Mock signature for demo
                }
            } else if (selectedWallet === 'hashpack') {
                // For Hedera, create mock signature for demo
                signature = `mock_hedera_signature_${Date.now()}`;
            } else {
                throw new Error('No wallet selected');
            }

            // Create user object (offline mode - no backend verification)
            const user = {
                id: Date.now().toString(),
                walletAddress: address.toLowerCase(),
                name: '',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                isFarmer: false,
                reputation: 0
            };

            // Generate mock JWT token
            const mockToken = `mock_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`;

            // Call onLogin callback
            onLogin(user, mockToken, { redirectTo, redirectState });
            
        } catch (err) {
            console.error('Authentication error:', err);
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setIsAuthenticating(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '2rem',
            background: 'var(--card-background)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-medium)',
            maxWidth: '500px',
            margin: '2rem auto'
        }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', textAlign: 'center' }}>
                🌾 Connect Your Wallet to FarmerChain
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
                Securely access the marketplace by connecting your Web3 wallet.
            </p>

            {error && (
                <div style={{
                    color: 'var(--error-color)',
                    background: 'rgba(220, 53, 69, 0.1)',
                    padding: '1rem',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '1.5rem',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'center' }}>
                    Choose Network:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button
                        onClick={() => {
                            setNetwork('ethereum');
                            setShowHederaInput(false);
                            setHederaAccountId('');
                            setError('');
                            setWalletAddress('');
                            setSelectedWallet('');
                        }}
                        disabled={isConnecting || isAuthenticating}
                        style={{
                            padding: '1rem',
                            border: network === 'ethereum' ? '2px solid var(--primary)' : '2px solid var(--border-color)',
                            borderRadius: 'var(--border-radius)',
                            background: network === 'ethereum' ? 'rgba(34, 139, 34, 0.1)' : 'var(--background-color)',
                            color: 'var(--text-primary)',
                            cursor: isConnecting || isAuthenticating ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: network === 'ethereum' ? '600' : '400',
                            transition: 'var(--transition)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <span style={{ fontSize: '2rem' }}>🦊</span>
                        <span>Ethereum</span>
                        <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>MetaMask</span>
                    </button>
                    
                    <button
                        onClick={() => {
                            setNetwork('hedera');
                            setShowHederaInput(false);
                            setHederaAccountId('');
                            setError('');
                            setWalletAddress('');
                            setSelectedWallet('');
                        }}
                        disabled={isConnecting || isAuthenticating}
                        style={{
                            padding: '1rem',
                            border: network === 'hedera' ? '2px solid var(--primary)' : '2px solid var(--border-color)',
                            borderRadius: 'var(--border-radius)',
                            background: network === 'hedera' ? 'rgba(34, 139, 34, 0.1)' : 'var(--background-color)',
                            color: 'var(--text-primary)',
                            cursor: isConnecting || isAuthenticating ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: network === 'hedera' ? '600' : '400',
                            transition: 'var(--transition)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <span style={{ fontSize: '2rem' }}>🔗</span>
                        <span>Hedera</span>
                        <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Account ID</span>
                    </button>
                </div>
            </div>

            {network === 'ethereum' && (
                <button
                    onClick={connectMetaMask}
                    disabled={isConnecting || isAuthenticating}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: isConnecting || isAuthenticating ? '#ccc' : 'var(--gradient-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        cursor: isConnecting || isAuthenticating ? 'not-allowed' : 'pointer',
                        transition: 'var(--transition)',
                        marginBottom: '1rem'
                    }}
                >
                    {isConnecting ? 'Connecting...' : isAuthenticating ? 'Authenticating...' : '🦊 Connect MetaMask'}
                </button>
            )}

            {network === 'hedera' && (
                <div style={{ width: '100%', marginBottom: '1rem' }}>
                    {!showHederaInput ? (
                        <button
                            onClick={() => setShowHederaInput(true)}
                            disabled={isConnecting || isAuthenticating}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: isConnecting || isAuthenticating ? '#ccc' : 'var(--gradient-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--border-radius)',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                cursor: isConnecting || isAuthenticating ? 'not-allowed' : 'pointer',
                                transition: 'var(--transition)'
                            }}
                        >
                            🔗 Connect Hedera Wallet
                        </button>
                    ) : (
                        <div style={{
                            background: 'var(--card-background)',
                            padding: '1.5rem',
                            borderRadius: 'var(--border-radius)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{ 
                                margin: '0 0 1rem 0', 
                                color: 'var(--primary)', 
                                fontSize: '1.1rem',
                                textAlign: 'center'
                            }}>
                                Enter Your Hedera Account ID
                            </h3>
                            
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '0.5rem', 
                                    fontWeight: '600', 
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem'
                                }}>
                                    Hedera Account ID:
                                </label>
                                <input
                                    type="text"
                                    value={hederaAccountId}
                                    onChange={(e) => setHederaAccountId(e.target.value)}
                                    placeholder="0.0.123456"
                                    disabled={isConnecting || isAuthenticating}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius)',
                                        fontSize: '1rem',
                                        background: 'var(--background-color)',
                                        color: 'var(--text-primary)',
                                        marginBottom: '0.5rem'
                                    }}
                                />
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '0.8rem', 
                                    color: 'var(--text-secondary)',
                                    fontStyle: 'italic'
                                }}>
                                    Format: 0.0.123456 (numbers separated by dots)
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={connectHashPack}
                                    disabled={isConnecting || isAuthenticating || !hederaAccountId.trim()}
                                    style={{
                                        flex: 1,
                                        padding: '0.8rem',
                                        background: isConnecting || isAuthenticating || !hederaAccountId.trim() ? '#ccc' : 'var(--gradient-primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--border-radius)',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: isConnecting || isAuthenticating || !hederaAccountId.trim() ? 'not-allowed' : 'pointer',
                                        transition: 'var(--transition)'
                                    }}
                                >
                                    {isConnecting ? 'Connecting...' : isAuthenticating ? 'Authenticating...' : 'Connect'}
                                </button>
                                
                                <button
                                    onClick={() => {
                                        setShowHederaInput(false);
                                        setHederaAccountId('');
                                        setError('');
                                    }}
                                    disabled={isConnecting || isAuthenticating}
                                    style={{
                                        padding: '0.8rem 1rem',
                                        background: 'var(--background-color)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius)',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: isConnecting || isAuthenticating ? 'not-allowed' : 'pointer',
                                        transition: 'var(--transition)'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {walletAddress && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(34, 139, 34, 0.1)',
                    borderRadius: 'var(--border-radius)',
                    width: '100%',
                    border: '1px solid rgba(34, 139, 34, 0.3)'
                }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        Connected Wallet:
                    </p>
                    <code style={{ 
                        background: 'var(--background-color)', 
                        padding: '0.5rem', 
                        borderRadius: '4px',
                        display: 'block',
                        wordBreak: 'break-all',
                        fontSize: '0.85rem',
                        color: 'var(--primary)'
                    }}>
                        {walletAddress}
                    </code>
                </div>
            )}

            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(34, 139, 34, 0.1)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid rgba(34, 139, 34, 0.3)',
                textAlign: 'center',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                width: '100%'
            }}>
                <p style={{ margin: 0, marginBottom: '0.5rem' }}>
                    ✅ <strong>Offline Mode Active</strong>
                </p>
                <p style={{ margin: 0 }}>
                    By connecting your wallet, you agree to the FarmerChain Terms of Service.
                    No private keys are ever requested or stored.
                </p>
            </div>
        </div>
    );
}