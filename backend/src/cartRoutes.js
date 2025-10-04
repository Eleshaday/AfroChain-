const express = require('express');
const { addToCart, getCartItems, clearCart } = require('./database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { coffeeType, quantity, price } = req.body;
        const userId = req.user.id;

        // Validation
        if (!coffeeType || !quantity || !price) {
            return res.status(400).json({ 
                error: 'Coffee type, quantity, and price are required' 
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({ 
                error: 'Quantity must be greater than 0' 
            });
        }

        const cartItem = await addToCart(userId, coffeeType, quantity, price);

        res.status(201).json({
            message: 'Item added to cart successfully',
            cartItem
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get cart items
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await getCartItems(userId);

        // Calculate total
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        res.json({
            cartItems,
            total: total.toFixed(2),
            itemCount: cartItems.length
        });

    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await clearCart(userId);

        res.json({
            message: 'Cart cleared successfully',
            itemsRemoved: result.changes
        });

    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

module.exports = router;
