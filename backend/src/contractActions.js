const { ContractExecuteTransaction } = require('@hashgraph/sdk');
const client = require('./hederaClient');

async function releaseToFarmer(contractId) {
    const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction('releaseToFarmer');

    const resp = await tx.execute(client);
    return resp.status.toString();
}

async function refundBuyer(contractId) {
    const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction('refundBuyer');

    const resp = await tx.execute(client);
    return resp.status.toString();
}

module.exports = { releaseToFarmer, refundBuyer };
