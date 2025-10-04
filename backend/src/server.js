const express = require('express');
const bodyParser = require('body-parser');
const { deployEscrowContract } = require('./deployContract');
const { releaseToFarmer, refundBuyer } = require('./contractActions');

const app = express();
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

app.listen(process.env.PORT || 4000, () => console.log('Backend running'));
