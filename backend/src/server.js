const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { deployEscrowContract } = require('./deployContract');
const { releaseToFarmer, refundBuyer } = require('./contractActions');
const { initializeDatabase } = require('./database');
const authRoutes = require('./authRoutes');
const cartRoutes = require('./cartRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Initialize database
initializeDatabase()
    .then(() => {
        console.log('Database initialized successfully');
    })
    .catch((error) => {
        console.error('Database initialization failed:', error);
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

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
