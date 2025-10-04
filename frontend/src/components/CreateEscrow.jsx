import React, { useState } from 'react';
import { deployEscrow } from '../api';

export default function CreateEscrow() {
    const [farmer, setFarmer] = useState('');
    const [arbiter, setArbiter] = useState('');
    const [amount, setAmount] = useState('1');
    const [result, setResult] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setResult('Deploying...');
        const res = await deployEscrow({ farmerAddress: farmer, arbiterAddress: arbiter, amount });
        setResult(JSON.stringify(res, null, 2));
    }

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Farmer address" value={farmer} onChange={e => setFarmer(e.target.value)} />
            <input placeholder="Arbiter address" value={arbiter} onChange={e => setArbiter(e.target.value)} />
            <input placeholder="Amount (HBAR)" value={amount} onChange={e => setAmount(e.target.value)} />
            <button type="submit">Create & Fund Escrow</button>
            <pre>{result}</pre>
        </form>
    );
}
