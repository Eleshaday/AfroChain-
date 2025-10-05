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

app.listen(process.env.PORT || 4000, () => console.log('Backend running'));
