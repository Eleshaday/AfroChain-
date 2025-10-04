const fs = require('fs');
const { ContractCreateTransaction, Hbar } = require('@hashgraph/sdk');
const client = require('./hederaClient');

async function deployEscrowContract(farmerAddress, arbiterAddress, amount) {
    const bytecode = fs.readFileSync('../contracts/Escrow.json').toString();
    const contractTx = await new ContractCreateTransaction()
        .setBytecode(bytecode)
        .setGas(3000000)
        .setInitialBalance(Hbar.from(amount))
        .execute(client);

    const receipt = await contractTx.getReceipt(client);
    return receipt.contractId.toString();
}

module.exports = { deployEscrowContract };
