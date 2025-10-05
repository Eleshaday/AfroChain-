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

export async function createNFTCertificate(coffeeData, tokenId = null) {
    const res = await fetch('http://localhost:4000/api/create-nft-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coffeeData, tokenId })
    });
    return res.json();
}

export async function generateAuthenticityData(coffeeData) {
    const res = await fetch('http://localhost:4000/api/generate-authenticity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coffeeData })
    });
    return res.json();
}

export async function verifyCoffeeAuthenticity(batchId, nftId = null) {
    const url = nftId ? `http://localhost:4000/api/verify/${batchId}?nftId=${nftId}` : `http://localhost:4000/api/verify/${batchId}`;
    const res = await fetch(url);
    return res.json();
}