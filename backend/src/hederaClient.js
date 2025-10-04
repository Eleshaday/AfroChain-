require('dotenv').config();
const { Client } = require('@hashgraph/sdk');

const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

module.exports = client;
