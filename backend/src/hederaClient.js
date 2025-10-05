require('dotenv').config();
const { Client, AccountId, PrivateKey } = require('@hashgraph/sdk');

let client = null;

try {
    const accountId = process.env.HEDERA_ACCOUNT_ID;
    const privateKey = process.env.HEDERA_PRIVATE_KEY;

    if (accountId && privateKey) {
        client = Client.forTestnet();
        client.setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey));
    } else {
        console.log('⚠️  Hedera credentials not configured. Hedera client disabled (mock mode).');
    }
} catch (err) {
    console.log('⚠️  Failed to initialize Hedera client. Running in mock mode.', err?.message);
    client = null;
}

module.exports = client;
