const express = require('express');
const bodyParser = require('body-parser');
const { deployEscrowContract } = require('./deployContract');
const { releaseToFarmer, refundBuyer } = require('./contractActions');
const blockchainService = require('./blockchainService');

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(bodyParser.json());

app.post('/api/deploy', async (req, res) => {
    const { farmerAddress, arbiterAddress, amount } = req.body;
    const contractId = await deployEscrowContract(farmerAddress, arbiterAddress, amount);
    res.json({ contractId });
});

app.post('/api/release', async (req, res) => {
    const { contractId } = req.body;
    const status = await releaseToFarmer(contractId);
    res.json({ status });
});

app.post('/api/refund', async (req, res) => {
    const { contractId } = req.body;
    const status = await refundBuyer(contractId);
    res.json({ status });
});

// Blockchain payment processing endpoint
app.post('/api/process-payment', async (req, res) => {
    const { walletAddress, amount, items, network = 'ethereum', privateKey } = req.body;
    
    try {
        console.log(`Processing ${network} payment: ${amount} to ${walletAddress}`);
        console.log('Items:', items);
        
        // Validate wallet address
        if (!blockchainService.validateWalletAddress(walletAddress, network)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid wallet address format'
            });
        }

        // Check wallet balance (optional)
        const balance = await blockchainService.getWalletBalance(walletAddress, network);
        console.log(`Wallet balance: ${balance} ${network === 'ethereum' ? 'ETH' : 'HBAR'}`);

        let result;
        
        if (network === 'ethereum') {
            if (!privateKey) {
                return res.status(400).json({
                    success: false,
                    error: 'Private key required for Ethereum transactions'
                });
            }
            result = await blockchainService.processEthereumPayment(walletAddress, amount, privateKey);
        } else if (network === 'hedera') {
            result = await blockchainService.processHederaPayment(walletAddress, amount);
        } else {
            return res.status(400).json({
                success: false,
                error: 'Unsupported network. Use "ethereum" or "hedera"'
            });
        }

        if (result.success) {
            // Store transaction in database (implement as needed)
            console.log('Transaction successful:', result);
            
            res.json({
                success: true,
                transactionHash: result.transactionHash,
                message: 'Payment processed successfully',
                blockNumber: result.blockNumber,
                gasUsed: result.gasUsed,
                network: result.network
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error || 'Payment processing failed'
            });
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({
            success: false,
            error: 'Payment processing failed',
            message: error.message
        });
    }
});

// Get transaction status endpoint
app.get('/api/transaction/:hash', async (req, res) => {
    const { hash } = req.params;
    const { network = 'ethereum' } = req.query;
    
    try {
        const status = await blockchainService.getTransactionStatus(hash, network);
        res.json(status);
    } catch (error) {
        console.error('Error getting transaction status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get transaction status',
            message: error.message
        });
    }
});

// Create NFT certificate for coffee batch
app.post('/api/create-nft-certificate', async (req, res) => {
    const { coffeeData, tokenId } = req.body;
    
    try {
        console.log('Creating NFT certificate for:', coffeeData.coffeeName);
        
        const result = await blockchainService.createCoffeeNFTCertificate(coffeeData, tokenId);
        
        if (result.success) {
            res.json({
                success: true,
                nftId: result.nftId,
                tokenId: result.tokenId,
                serialNumber: result.serialNumber,
                metadata: result.metadata,
                network: result.network
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('NFT creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create NFT certificate',
            message: error.message
        });
    }
});

// Generate authenticity data and QR code
app.post('/api/generate-authenticity', async (req, res) => {
    const { coffeeData } = req.body;
    
    try {
        console.log('Generating authenticity data for:', coffeeData.coffeeName);
        
        const authenticityData = blockchainService.generateAuthenticityData(coffeeData);
        
        res.json({
            success: true,
            batchId: authenticityData.batchId,
            qrData: authenticityData.qrData,
            verificationUrl: authenticityData.verificationUrl
        });
    } catch (error) {
        console.error('Authenticity generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate authenticity data',
            message: error.message
        });
    }
});

// Verify coffee authenticity
app.get('/api/verify/:batchId', async (req, res) => {
    const { batchId } = req.params;
    const { nftId } = req.query;
    
    try {
        console.log('Verifying authenticity for batch:', batchId);
        
        const result = await blockchainService.verifyCoffeeAuthenticity(batchId, nftId);
        
        res.json(result);
    } catch (error) {
        console.error('Authenticity verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify authenticity',
            message: error.message
        });
    }
});

// Create supply chain tracking topic
app.post('/api/supply-chain/create-topic', async (req, res) => {
    const { batchId } = req.body;
    
    try {
        console.log('Creating supply chain topic for batch:', batchId);
        
        const result = await blockchainService.createSupplyChainTopic(batchId);
        
        res.json(result);
    } catch (error) {
        console.error('Supply chain topic creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create supply chain topic',
            message: error.message
        });
    }
});

// Add supply chain step
app.post('/api/supply-chain/add-step', async (req, res) => {
    const { batchId, stepData } = req.body;
    
    try {
        console.log('Adding supply chain step for batch:', batchId, 'Step:', stepData.step);
        
        const result = await blockchainService.addSupplyChainStep(batchId, stepData);
        
        res.json(result);
    } catch (error) {
        console.error('Supply chain step addition error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add supply chain step',
            message: error.message
        });
    }
});

// Get supply chain history
app.get('/api/supply-chain/:batchId', async (req, res) => {
    const { batchId } = req.params;
    
    try {
        console.log('Getting supply chain history for batch:', batchId);
        
        const result = await blockchainService.getSupplyChainHistory(batchId);
        
        res.json(result);
    } catch (error) {
        console.error('Supply chain history retrieval error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get supply chain history',
            message: error.message
        });
    }
});

// Create coffee token
app.post('/api/tokens/create', async (req, res) => {
    const { tokenData } = req.body;
    
    try {
        console.log('Creating coffee token:', tokenData.name);
        
        const result = await blockchainService.createCoffeeToken(tokenData);
        
        res.json(result);
    } catch (error) {
        console.error('Coffee token creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create coffee token',
            message: error.message
        });
    }
});

// Process coffee token payment
app.post('/api/tokens/payment', async (req, res) => {
    const { tokenId, recipientAccountId, amount, memo } = req.body;
    
    try {
        console.log('Processing coffee token payment:', { tokenId, recipientAccountId, amount });
        
        const result = await blockchainService.processCoffeeTokenPayment({
            tokenId,
            recipientAccountId,
            amount,
            memo
        });
        
        res.json(result);
    } catch (error) {
        console.error('Coffee token payment error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process coffee token payment',
            message: error.message
        });
    }
});

// Get token balance
app.get('/api/tokens/balance/:accountId/:tokenId', async (req, res) => {
    const { accountId, tokenId } = req.params;
    
    try {
        console.log('Getting token balance for account:', accountId, 'token:', tokenId);
        
        const result = await blockchainService.getTokenBalance(accountId, tokenId);
        
        res.json(result);
    } catch (error) {
        console.error('Token balance query error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get token balance',
            message: error.message
        });
    }
});

// Create loyalty token
app.post('/api/tokens/loyalty/create', async (req, res) => {
    try {
        console.log('Creating CoffeeCoin loyalty token...');
        
        const result = await blockchainService.createCoffeeCoinLoyaltyToken();
        
        res.json(result);
    } catch (error) {
        console.error('Loyalty token creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create loyalty token',
            message: error.message
        });
    }
});

// Process loyalty reward
app.post('/api/tokens/loyalty/reward', async (req, res) => {
    const { recipientAccountId, rewardAmount, reason } = req.body;
    
    try {
        console.log('Processing loyalty reward:', { recipientAccountId, rewardAmount, reason });
        
        const result = await blockchainService.processLoyaltyReward(recipientAccountId, rewardAmount, reason);
        
        res.json(result);
    } catch (error) {
        console.error('Loyalty reward processing error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process loyalty reward',
            message: error.message
        });
    }
});

app.listen(process.env.PORT || 4000, () => console.log('Backend running'));
