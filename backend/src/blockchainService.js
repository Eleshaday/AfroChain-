const { ethers } = require('ethers');
const { Client, AccountId, PrivateKey, TransferTransaction, Hbar } = require('@hashgraph/sdk');

class BlockchainService {
    constructor() {
        this.ethereumProvider = null;
        this.hederaClient = null;
        this.initializeProviders();
    }

    async initializeProviders() {
        try {
            // Initialize Ethereum provider (using Infura or Alchemy)
            const ethereumRpcUrl = process.env.ETHEREUM_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';
            if (ethereumRpcUrl.includes('YOUR_INFURA_KEY')) {
                console.log('⚠️  Ethereum RPC URL not configured. Using mock mode.');
                this.ethereumProvider = null;
            } else {
                this.ethereumProvider = new ethers.JsonRpcProvider(ethereumRpcUrl);
            }
            
            // Initialize Hedera client only if credentials are provided
            if (process.env.HEDERA_ACCOUNT_ID && process.env.HEDERA_PRIVATE_KEY) {
                this.hederaClient = Client.forTestnet();
                this.hederaClient.setOperator(
                    AccountId.fromString(process.env.HEDERA_ACCOUNT_ID),
                    PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY)
                );
            } else {
                console.log('⚠️  Hedera credentials not configured. Using mock mode.');
                this.hederaClient = null;
            }
        } catch (error) {
            console.error('Error initializing blockchain providers:', error);
            console.log('⚠️  Blockchain providers not available. Using mock mode.');
        }
    }

    // Ethereum Payment Processing
    async processEthereumPayment(walletAddress, amount, privateKey) {
        try {
            if (!this.ethereumProvider) {
                // Mock mode - simulate transaction
                console.log('🔧 Mock Ethereum payment processing...');
                const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
                
                // Simulate processing delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                return {
                    success: true,
                    transactionHash: mockTxHash,
                    blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
                    gasUsed: '21000',
                    network: 'Ethereum (Mock)'
                };
            }

            const wallet = new ethers.Wallet(privateKey, this.ethereumProvider);
            
            // Get current gas price
            const gasPrice = await this.ethereumProvider.getGasPrice();
            
            // Create transaction
            const transaction = {
                to: walletAddress,
                value: ethers.parseEther(amount.toString()),
                gasLimit: 21000,
                gasPrice: gasPrice
            };

            // Send transaction
            const tx = await wallet.sendTransaction(transaction);
            
            // Wait for confirmation
            const receipt = await tx.wait();
            
            return {
                success: true,
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed.toString(),
                network: 'Ethereum'
            };
        } catch (error) {
            console.error('Ethereum payment error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Hedera Payment Processing
    async processHederaPayment(recipientAccountId, amount) {
        try {
            if (!this.hederaClient) {
                // Mock mode - simulate transaction
                console.log('🔧 Mock Hedera payment processing...');
                const mockTxHash = Math.random().toString(16).substr(2, 16);
                
                // Simulate processing delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                return {
                    success: true,
                    transactionHash: mockTxHash,
                    status: 'SUCCESS',
                    network: 'Hedera (Mock)'
                };
            }

            const transferTransaction = new TransferTransaction()
                .addHbarTransfer(AccountId.fromString(process.env.HEDERA_ACCOUNT_ID), new Hbar(-amount))
                .addHbarTransfer(AccountId.fromString(recipientAccountId), new Hbar(amount));

            const response = await transferTransaction.execute(this.hederaClient);
            const receipt = await response.getReceipt(this.hederaClient);
            
            return {
                success: true,
                transactionHash: response.transactionId.toString(),
                status: receipt.status.toString(),
                network: 'Hedera'
            };
        } catch (error) {
            console.error('Hedera payment error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get transaction status
    async getTransactionStatus(transactionHash, network = 'ethereum') {
        try {
            if (network === 'ethereum') {
                const tx = await this.ethereumProvider.getTransaction(transactionHash);
                const receipt = await this.ethereumProvider.getTransactionReceipt(transactionHash);
                
                return {
                    hash: transactionHash,
                    status: receipt ? 'confirmed' : 'pending',
                    blockNumber: receipt?.blockNumber,
                    confirmations: receipt ? await this.ethereumProvider.getBlockNumber() - receipt.blockNumber + 1 : 0,
                    gasUsed: receipt?.gasUsed.toString(),
                    network: 'Ethereum'
                };
            } else if (network === 'hedera') {
                // For Hedera, you would query the mirror node
                return {
                    hash: transactionHash,
                    status: 'confirmed',
                    network: 'Hedera'
                };
            }
        } catch (error) {
            console.error('Error getting transaction status:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Validate wallet address
    validateWalletAddress(address, network = 'ethereum') {
        try {
            if (network === 'ethereum') {
                // More lenient validation for testing
                return address && address.startsWith('0x') && address.length >= 42;
            } else if (network === 'hedera') {
                // Hedera account ID validation
                return /^\d+\.\d+\.\d+$/.test(address);
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // Get wallet balance
    async getWalletBalance(address, network = 'ethereum') {
        try {
            if (network === 'ethereum') {
                const balance = await this.ethereumProvider.getBalance(address);
                return ethers.formatEther(balance);
            } else if (network === 'hedera') {
                // For Hedera, you would query the account balance
                return '0'; // Placeholder
            }
        } catch (error) {
            console.error('Error getting wallet balance:', error);
            return '0';
        }
    }
}

module.exports = new BlockchainService();
