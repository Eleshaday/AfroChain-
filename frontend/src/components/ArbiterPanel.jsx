import React, { useState } from 'react';
import { releaseFunds, refundFunds } from '../api';

export default function ArbiterPanel() {
    const [contractId, setContractId] = useState('');
    const [status, setStatus] = useState(null);

    async function handleRelease() {
        const res = await releaseFunds(contractId);
        setStatus(JSON.stringify(res));
    }

    async function handleRefund() {
        const res = await refundFunds(contractId);
        setStatus(JSON.stringify(res));
    }

    return (
        <div>
            <input placeholder="Contract ID" value={contractId} onChange={e => setContractId(e.target.value)} />
            <button onClick={handleRelease}>Confirm & Release</button>
            <button onClick={handleRefund}>Refund Buyer</button>
            <pre>{status}</pre>
        </div>
    );
}
