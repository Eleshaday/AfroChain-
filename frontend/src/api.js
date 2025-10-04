export async function deployEscrow(data) {
    const res = await fetch('http://localhost:4000/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function releaseFunds(contractId) {
    const res = await fetch('http://localhost:4000/api/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId })
    });
    return res.json();
}

export async function refundFunds(contractId) {
    const res = await fetch('http://localhost:4000/api/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId })
    });
    return res.json();
}
