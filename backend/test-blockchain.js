const blockchainService = require('./src/blockchainService');

async function testBlockchainService() {
    console.log('🔗 Testing Blockchain Service...\n');

    // Test wallet address validation
    console.log('1. Testing wallet address validation:');
    
    const validEthAddress = '0x742d35Cc6634C0532925a3b8D0C0C1C0C0C0C0C0';
    const invalidEthAddress = '0xinvalid';
    const validHederaAccount = '0.0.123456';
    const invalidHederaAccount = 'invalid.account';

    console.log(`Ethereum address ${validEthAddress}: ${blockchainService.validateWalletAddress(validEthAddress, 'ethereum')}`);
    console.log(`Invalid Ethereum address: ${blockchainService.validateWalletAddress(invalidEthAddress, 'ethereum')}`);
    console.log(`Hedera account ${validHederaAccount}: ${blockchainService.validateWalletAddress(validHederaAccount, 'hedera')}`);
    console.log(`Invalid Hedera account: ${blockchainService.validateWalletAddress(invalidHederaAccount, 'hedera')}\n`);

    // Test wallet balance (mock)
    console.log('2. Testing wallet balance:');
    try {
        const ethBalance = await blockchainService.getWalletBalance(validEthAddress, 'ethereum');
        console.log(`Ethereum balance: ${ethBalance} ETH`);
        
        const hbarBalance = await blockchainService.getWalletBalance(validHederaAccount, 'hedera');
        console.log(`Hedera balance: ${hbarBalance} HBAR\n`);
    } catch (error) {
        console.log('Balance check failed (expected in test environment):', error.message, '\n');
    }

    // Test transaction status (mock)
    console.log('3. Testing transaction status:');
    try {
        const mockTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const txStatus = await blockchainService.getTransactionStatus(mockTxHash, 'ethereum');
        console.log('Transaction status:', txStatus);
    } catch (error) {
        console.log('Transaction status check failed (expected in test environment):', error.message);
    }

    console.log('\n✅ Blockchain service test completed!');
    console.log('\n📝 To test real transactions:');
    console.log('1. Set up your .env file with real API keys');
    console.log('2. Use testnet addresses and private keys');
    console.log('3. Ensure you have test ETH/HBAR in your wallet');
    console.log('4. Run the coffee marketplace and try a purchase!');
}

// Run the test
testBlockchainService().catch(console.error);
