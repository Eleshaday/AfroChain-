import React from 'react';
import CreateEscrow from './components/CreateEscrow';
import ArbiterPanel from './components/ArbiterPanel';

export default function App() {
    return (
        <div>
            <h1>Hedera Escrow Webapp</h1>
            <CreateEscrow />
            <hr />
            <ArbiterPanel />
        </div>
    );
}
