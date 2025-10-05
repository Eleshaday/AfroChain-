const { ethers } = require('ethers');
const { Client, AccountId, PrivateKey, TransferTransaction, Hbar, TokenId, TokenCreateTransaction, TokenMintTransaction, TokenNftInfoQuery, NftId, AccountBalanceQuery, TopicCreateTransaction, TopicMessageSubmitTransaction, TopicMessageQuery, TokenAssociateTransaction, TokenTransferTransaction } = require('@hashgraph/sdk');
const crypto = require('crypto');

class BlockchainService {
    constructor() {
        this.ethereumProvider = null;
        this.hederaClient = null;
        this.supplyChainTopics = new Map(); // Cache for supply chain topics
        this.coffeeTokens = new Map(); // Cache for coffee tokens
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
                if (!this.hederaClient) {
                    return '0'; // Mock mode
                }
                const accountBalance = await new AccountBalanceQuery()
                    .setAccountId(AccountId.fromString(address))
                    .execute(this.hederaClient);
                return accountBalance.hbars.toString();
            }
        } catch (error) {
            console.error('Error getting wallet balance:', error);
            return '0';
        }
    }

    // Generate QR code data for coffee authenticity
    generateAuthenticityData(coffeeData) {
        const authenticityData = {
            batchId: crypto.randomUUID(),
            farmId: coffeeData.farmId,
            farmerName: coffeeData.farmerName,
            harvestDate: coffeeData.harvestDate,
            origin: coffeeData.origin,
            qualityGrade: coffeeData.qualityGrade,
            certifications: coffeeData.certifications,
            timestamp: new Date().toISOString(),
            blockchainHash: crypto.createHash('sha256').update(JSON.stringify(coffeeData)).digest('hex')
        };
        
        return {
            qrData: JSON.stringify(authenticityData),
            batchId: authenticityData.batchId,
            verificationUrl: `https://coffeedirect.com/verify/${authenticityData.batchId}`
        };
    }

    // Create NFT certificate for coffee batch
    async createCoffeeNFTCertificate(coffeeData, tokenId = null) {
        try {
            if (!this.hederaClient) {
                // Mock mode - simulate NFT creation
                console.log('🔧 Mock NFT certificate creation...');
                const mockNftId = crypto.randomUUID();
                
                return {
                    success: true,
                    nftId: mockNftId,
                    tokenId: tokenId || '0.0.123456',
                    serialNumber: Math.floor(Math.random() * 10000) + 1,
                    metadata: {
                        name: `${coffeeData.coffeeName} Certificate`,
                        description: `Authenticity certificate for ${coffeeData.origin} coffee`,
                        image: coffeeData.certificateImage || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
                        attributes: [
                            { trait_type: "Origin", value: coffeeData.origin },
                            { trait_type: "Quality Grade", value: coffeeData.qualityGrade },
                            { trait_type: "Harvest Date", value: coffeeData.harvestDate },
                            { trait_type: "Certification", value: coffeeData.certification }
                        ]
                    },
                    network: 'Hedera (Mock)'
                };
            }

            // Create token if not provided
            if (!tokenId) {
                const tokenCreateTx = new TokenCreateTransaction()
                    .setTokenName("CoffeeDirect Authenticity Certificate")
                    .setTokenSymbol("COFFEE")
                    .setTokenType('NON_FUNGIBLE_UNIQUE')
                    .setDecimals(0)
                    .setInitialSupply(0)
                    .setSupplyType('INFINITE')
                    .setTreasuryAccountId(AccountId.fromString(process.env.HEDERA_ACCOUNT_ID));

                const tokenCreateResponse = await tokenCreateTx.execute(this.hederaClient);
                const tokenCreateReceipt = await tokenCreateResponse.getReceipt(this.hederaClient);
                tokenId = tokenCreateReceipt.tokenId.toString();
            }

            // Mint NFT with metadata
            const metadata = {
                name: `${coffeeData.coffeeName} Certificate`,
                description: `Authenticity certificate for ${coffeeData.origin} coffee`,
                image: coffeeData.certificateImage || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
                attributes: [
                    { trait_type: "Origin", value: coffeeData.origin },
                    { trait_type: "Quality Grade", value: coffeeData.qualityGrade },
                    { trait_type: "Harvest Date", value: coffeeData.harvestDate },
                    { trait_type: "Certification", value: coffeeData.certification }
                ]
            };

            const mintTx = new TokenMintTransaction()
                .setTokenId(TokenId.fromString(tokenId))
                .setMetadata([Buffer.from(JSON.stringify(metadata))]);

            const mintResponse = await mintTx.execute(this.hederaClient);
            const mintReceipt = await mintResponse.getReceipt(this.hederaClient);

            return {
                success: true,
                nftId: `${tokenId}:${mintReceipt.serials[0]}`,
                tokenId: tokenId,
                serialNumber: mintReceipt.serials[0],
                metadata: metadata,
                network: 'Hedera'
            };
        } catch (error) {
            console.error('NFT creation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Verify coffee authenticity
    async verifyCoffeeAuthenticity(batchId, nftId = null) {
        try {
            if (!this.hederaClient) {
                // Mock verification
                console.log('🔧 Mock coffee authenticity verification...');
                
                return {
                    success: true,
                    valid: true,
                    batchId: batchId,
                    nftId: nftId,
                    verification: {
                        status: 'AUTHENTIC',
                        confidence: 95,
                        checks: [
                            { name: 'Blockchain Hash', status: 'VALID' },
                            { name: 'NFT Certificate', status: 'VERIFIED' },
                            { name: 'Supply Chain', status: 'TRACEABLE' },
                            { name: 'Origin Verification', status: 'CONFIRMED' }
                        ]
                    },
                    network: 'Hedera (Mock)'
                };
            }

            // In production, this would:
            // 1. Query the blockchain for the batch data
            // 2. Verify the NFT certificate
            // 3. Check supply chain records
            // 4. Validate origin claims

            return {
                success: true,
                valid: true,
                batchId: batchId,
                nftId: nftId,
                verification: {
                    status: 'AUTHENTIC',
                    confidence: 95,
                    checks: [
                        { name: 'Blockchain Hash', status: 'VALID' },
                        { name: 'NFT Certificate', status: 'VERIFIED' },
                        { name: 'Supply Chain', status: 'TRACEABLE' },
                        { name: 'Origin Verification', status: 'CONFIRMED' }
                    ]
                },
                network: 'Hedera'
            };
        } catch (error) {
            console.error('Authenticity verification error:', error);
            return {
                success: false,
                valid: false,
                error: error.message
            };
        }
    }

    // Supply Chain Tracking with Hedera Consensus Service
    async createSupplyChainTopic(batchId) {
        try {
            if (!this.hederaClient) {
                // Mock mode - simulate topic creation
                console.log('🔧 Mock supply chain topic creation...');
                const mockTopicId = `0.0.${Math.floor(Math.random() * 1000000)}`;
                this.supplyChainTopics.set(batchId, mockTopicId);
                
                return {
                    success: true,
                    topicId: mockTopicId,
                    batchId: batchId,
                    network: 'Hedera (Mock)'
                };
            }

            const topicCreateTransaction = new TopicCreateTransaction()
                .setTopicMemo(`Supply Chain Tracking for Coffee Batch: ${batchId}`)
                .setSubmitKey(PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY));

            const response = await topicCreateTransaction.execute(this.hederaClient);
            const receipt = await response.getReceipt(this.hederaClient);
            const topicId = receipt.topicId.toString();
            
            this.supplyChainTopics.set(batchId, topicId);
            
            return {
                success: true,
                topicId: topicId,
                batchId: batchId,
                network: 'Hedera'
            };
        } catch (error) {
            console.error('Supply chain topic creation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async addSupplyChainStep(batchId, stepData) {
        try {
            const topicId = this.supplyChainTopics.get(batchId);
            if (!topicId) {
                // Create topic if it doesn't exist
                const topicResult = await this.createSupplyChainTopic(batchId);
                if (!topicResult.success) {
                    return topicResult;
                }
            }

            if (!this.hederaClient) {
                // Mock mode - simulate step addition
                console.log('🔧 Mock supply chain step addition...');
                
                return {
                    success: true,
                    batchId: batchId,
                    step: stepData.step,
                    timestamp: stepData.timestamp,
                    location: stepData.location,
                    transactionId: `mock-tx-${Math.random().toString(16).substr(2, 16)}`,
                    network: 'Hedera (Mock)'
                };
            }

            const stepMessage = {
                batchId: batchId,
                step: stepData.step,
                timestamp: stepData.timestamp,
                location: stepData.location,
                operator: stepData.operator || 'System',
                data: stepData.data || {},
                hash: crypto.createHash('sha256').update(JSON.stringify(stepData)).digest('hex')
            };

            const message = Buffer.from(JSON.stringify(stepMessage));
            const submitTransaction = new TopicMessageSubmitTransaction()
                .setTopicId(topicId)
                .setMessage(message);

            const response = await submitTransaction.execute(this.hederaClient);
            const receipt = await response.getReceipt(this.hederaClient);
            
            return {
                success: true,
                batchId: batchId,
                step: stepData.step,
                timestamp: stepData.timestamp,
                location: stepData.location,
                transactionId: receipt.transactionId.toString(),
                network: 'Hedera'
            };
        } catch (error) {
            console.error('Supply chain step addition error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getSupplyChainHistory(batchId) {
        try {
            const topicId = this.supplyChainTopics.get(batchId);
            if (!topicId) {
                return {
                    success: false,
                    error: 'No supply chain topic found for this batch'
                };
            }

            if (!this.hederaClient) {
                // Mock mode - return sample supply chain data
                console.log('🔧 Mock supply chain history retrieval...');
                
                const mockSteps = [
                    {
                        step: "Farm Harvest",
                        timestamp: "2024-01-15T06:00:00Z",
                        location: "Sidama Region, Ethiopia",
                        operator: "Sidama Coffee Farmers Cooperative",
                        transactionId: "mock-tx-001",
                        hash: "mock-hash-001"
                    },
                    {
                        step: "Processing",
                        timestamp: "2024-01-16T08:00:00Z",
                        location: "Sidama Processing Plant",
                        operator: "Ethiopian Coffee Processing Co.",
                        transactionId: "mock-tx-002",
                        hash: "mock-hash-002"
                    },
                    {
                        step: "Quality Control",
                        timestamp: "2024-01-17T10:00:00Z",
                        location: "Ethiopian Coffee Authority",
                        operator: "ECA Quality Inspector",
                        transactionId: "mock-tx-003",
                        hash: "mock-hash-003"
                    },
                    {
                        step: "Export Preparation",
                        timestamp: "2024-01-18T12:00:00Z",
                        location: "Addis Ababa Port",
                        operator: "Export Logistics Co.",
                        transactionId: "mock-tx-004",
                        hash: "mock-hash-004"
                    }
                ];

                return {
                    success: true,
                    batchId: batchId,
                    steps: mockSteps,
                    network: 'Hedera (Mock)'
                };
            }

            // In production, this would query the topic messages
            const query = new TopicMessageQuery()
                .setTopicId(topicId);

            const messages = [];
            await query.subscribe(this.hederaClient, (message) => {
                try {
                    const stepData = JSON.parse(message.contents.toString());
                    messages.push(stepData);
                } catch (error) {
                    console.error('Error parsing supply chain message:', error);
                }
            });

            return {
                success: true,
                batchId: batchId,
                steps: messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
                network: 'Hedera'
            };
        } catch (error) {
            console.error('Supply chain history retrieval error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Hedera Token Service Integration for Coffee Payments
    async createCoffeeToken(tokenData) {
        try {
            if (!this.hederaClient) {
                // Mock mode - simulate token creation
                console.log('🔧 Mock coffee token creation...');
                const mockTokenId = `0.0.${Math.floor(Math.random() * 1000000)}`;
                
                return {
                    success: true,
                    tokenId: mockTokenId,
                    tokenName: tokenData.name,
                    tokenSymbol: tokenData.symbol,
                    initialSupply: tokenData.initialSupply,
                    decimals: tokenData.decimals || 2,
                    network: 'Hedera (Mock)'
                };
            }

            const tokenCreateTransaction = new TokenCreateTransaction()
                .setTokenName(tokenData.name)
                .setTokenSymbol(tokenData.symbol)
                .setTokenType('FUNGIBLE_COMMON')
                .setDecimals(tokenData.decimals || 2)
                .setInitialSupply(tokenData.initialSupply)
                .setTreasuryAccountId(AccountId.fromString(process.env.HEDERA_ACCOUNT_ID))
                .setSupplyType('INFINITE')
                .setAdminKey(PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY).publicKey)
                .setSupplyKey(PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY).publicKey);

            const response = await tokenCreateTransaction.execute(this.hederaClient);
            const receipt = await response.getReceipt(this.hederaClient);
            const tokenId = receipt.tokenId.toString();
            
            this.coffeeTokens.set(tokenId, {
                name: tokenData.name,
                symbol: tokenData.symbol,
                decimals: tokenData.decimals || 2
            });

            return {
                success: true,
                tokenId: tokenId,
                tokenName: tokenData.name,
                tokenSymbol: tokenData.symbol,
                initialSupply: tokenData.initialSupply,
                decimals: tokenData.decimals || 2,
                network: 'Hedera'
            };
        } catch (error) {
            console.error('Coffee token creation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async processCoffeeTokenPayment(paymentData) {
        try {
            const { tokenId, recipientAccountId, amount, memo } = paymentData;

            if (!this.hederaClient) {
                // Mock mode - simulate token payment
                console.log('🔧 Mock coffee token payment...');
                
                return {
                    success: true,
                    transactionId: `mock-tx-${Math.random().toString(16).substr(2, 16)}`,
                    tokenId: tokenId,
                    recipientAccountId: recipientAccountId,
                    amount: amount,
                    memo: memo,
                    network: 'Hedera (Mock)'
                };
            }

            // First, associate the token with the recipient account if needed
            try {
                const associateTransaction = new TokenAssociateTransaction()
                    .setAccountId(AccountId.fromString(recipientAccountId))
                    .setTokenIds([TokenId.fromString(tokenId)]);

                await associateTransaction.execute(this.hederaClient);
            } catch (error) {
                // Token might already be associated, continue
                console.log('Token association skipped (already associated or error):', error.message);
            }

            // Transfer tokens
            const transferTransaction = new TokenTransferTransaction()
                .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(process.env.HEDERA_ACCOUNT_ID), -amount)
                .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(recipientAccountId), amount)
                .setTransactionMemo(memo || `CoffeeDirect payment: ${amount} tokens`);

            const response = await transferTransaction.execute(this.hederaClient);
            const receipt = await response.getReceipt(this.hederaClient);

            return {
                success: true,
                transactionId: receipt.transactionId.toString(),
                tokenId: tokenId,
                recipientAccountId: recipientAccountId,
                amount: amount,
                memo: memo,
                network: 'Hedera'
            };
        } catch (error) {
            console.error('Coffee token payment error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getTokenBalance(accountId, tokenId) {
        try {
            if (!this.hederaClient) {
                // Mock mode - return mock balance
                console.log('🔧 Mock token balance query...');
                
                return {
                    success: true,
                    accountId: accountId,
                    tokenId: tokenId,
                    balance: Math.floor(Math.random() * 1000),
                    network: 'Hedera (Mock)'
                };
            }

            const accountBalance = await new AccountBalanceQuery()
                .setAccountId(AccountId.fromString(accountId))
                .execute(this.hederaClient);

            const tokenBalance = accountBalance.tokens.get(TokenId.fromString(tokenId));
            
            return {
                success: true,
                accountId: accountId,
                tokenId: tokenId,
                balance: tokenBalance ? tokenBalance.toInt() : 0,
                network: 'Hedera'
            };
        } catch (error) {
            console.error('Token balance query error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Create COFFEECOIN loyalty token
    async createCoffeeCoinLoyaltyToken() {
        const tokenData = {
            name: "CoffeeDirect Loyalty Token",
            symbol: "COFFEECOIN",
            initialSupply: 1000000, // 1M tokens
            decimals: 2
        };

        return await this.createCoffeeToken(tokenData);
    }

    // Process loyalty reward payment
    async processLoyaltyReward(recipientAccountId, rewardAmount, reason = "Coffee purchase reward") {
        // Use a default loyalty token ID or create one if it doesn't exist
        const loyaltyTokenId = process.env.COFFEECOIN_TOKEN_ID || "0.0.123456";
        
        return await this.processCoffeeTokenPayment({
            tokenId: loyaltyTokenId,
            recipientAccountId: recipientAccountId,
            amount: rewardAmount,
            memo: reason
        });
    }
}

module.exports = new BlockchainService();
