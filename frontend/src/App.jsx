import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Home from './components/Home';
import Login from './components/Login';
import Products from './components/Products';
import About from './components/About';
import Contact from './components/Contact';
import HederaBlockchain from './components/HederaBlockchain';

export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/hedera-blockchain" element={<HederaBlockchain />} />
                </Routes>
            </CartProvider>
        </AuthProvider>
    );
}
