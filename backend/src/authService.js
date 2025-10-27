const fs = require('fs-extra');
const path = require('path');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');

const DB_PATH = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DB_PATH, 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

async function ensureDb() {
    await fs.ensureDir(DB_PATH);
    if (!(await fs.pathExists(USERS_FILE))) {
        await fs.writeJson(USERS_FILE, { users: [] }, { spaces: 2 });
    }
}

async function readUsers() {
    await ensureDb();
    const data = await fs.readJson(USERS_FILE);
    return data.users || [];
}

async function writeUsers(users) {
    await ensureDb();
    await fs.writeJson(USERS_FILE, { users }, { spaces: 2 });
}

// Verify wallet signature for authentication
function verifyWalletSignature(walletAddress, signature, message) {
    try {
        // Recover the address from the signature
        const recoveredAddress = ethers.verifyMessage(message, signature);
        
        // Check if the recovered address matches the provided address
        return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

// Generate authentication message
function generateAuthMessage(walletAddress, timestamp) {
    return `Welcome to FarmerChain!\n\nPlease sign this message to authenticate with your wallet.\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${Math.random().toString(36).substring(2, 15)}`;
}

// Wallet-based authentication
async function authenticateWallet({ walletAddress, signature, message }) {
    try {
        // Verify the signature
        if (!verifyWalletSignature(walletAddress, signature, message)) {
            return { success: false, error: 'Invalid signature' };
        }

        // Check if user exists
        const users = await readUsers();
        let user = users.find(u => u.walletAddress.toLowerCase() === walletAddress.toLowerCase());

        if (!user) {
            // Create new user
            user = {
                id: Date.now().toString(),
                walletAddress: walletAddress.toLowerCase(),
                name: '', // Optional name field
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                products: [],
                isFarmer: false,
                reputation: 0
            };
    users.push(user);
    await writeUsers(users);
        } else {
            // Update last login
            user.lastLogin = new Date().toISOString();
            await writeUsers(users);
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                sub: user.id, 
                walletAddress: user.walletAddress,
                isFarmer: user.isFarmer 
            }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        return { 
            success: true, 
            user: { 
                id: user.id, 
                walletAddress: user.walletAddress, 
                name: user.name,
                isFarmer: user.isFarmer,
                reputation: user.reputation
            }, 
            token 
        };
    } catch (error) {
        console.error('Wallet authentication error:', error);
        return { success: false, error: 'Authentication failed' };
    }
}

// Update user profile
async function updateUserProfile(walletAddress, profileData) {
    try {
        const users = await readUsers();
        const userIndex = users.findIndex(u => u.walletAddress.toLowerCase() === walletAddress.toLowerCase());
        
        if (userIndex === -1) {
            return { success: false, error: 'User not found' };
        }

        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            ...profileData,
            walletAddress: walletAddress.toLowerCase(), // Ensure lowercase
            updatedAt: new Date().toISOString()
        };

        await writeUsers(users);

        return { 
            success: true, 
            user: { 
                id: users[userIndex].id,
                walletAddress: users[userIndex].walletAddress,
                name: users[userIndex].name,
                isFarmer: users[userIndex].isFarmer,
                reputation: users[userIndex].reputation
            } 
        };
    } catch (error) {
        console.error('Profile update error:', error);
        return { success: false, error: 'Profile update failed' };
    }
}

// Get user by wallet address
async function getUserByWallet(walletAddress) {
    try {
        const users = await readUsers();
        const user = users.find(u => u.walletAddress.toLowerCase() === walletAddress.toLowerCase());
        
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        return { 
            success: true, 
            user: { 
                id: user.id,
                walletAddress: user.walletAddress,
                name: user.name,
                isFarmer: user.isFarmer,
                reputation: user.reputation,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            } 
        };
    } catch (error) {
        console.error('Get user error:', error);
        return { success: false, error: 'Failed to get user' };
    }
}

// Legacy functions for backward compatibility (deprecated)
async function signup({ email, password, name = '' }) {
    return { success: false, error: 'Email-based signup is deprecated. Please use wallet authentication.' };
}

async function login({ email, password }) {
    return { success: false, error: 'Email-based login is deprecated. Please use wallet authentication.' };
}

module.exports = { 
    authenticateWallet, 
    generateAuthMessage, 
    updateUserProfile, 
    getUserByWallet,
    // Legacy functions (deprecated)
    signup, 
    login 
};


