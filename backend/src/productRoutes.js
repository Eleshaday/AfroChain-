const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to products data file
const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Initialize products data if it doesn't exist
const initializeProducts = async () => {
    try {
        await fs.access(PRODUCTS_FILE);
    } catch (error) {
        // File doesn't exist, create it with mock data
        const mockProducts = [
            {
                id: 1,
                productName: "Ethiopian Yirgacheffe Coffee",
                category: "Coffee",
                origin: "Ethiopia",
                description: "Premium single-origin coffee with floral notes and bright acidity",
                price: "$24.99",
                qualityLevel: "Premium",
                certification: "Organic",
                batchId: "ETH-YIR-001",
                image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                supplyChainSteps: [
                    { step: "Harvested", timestamp: "2024-01-15", location: "Yirgacheffe, Ethiopia" },
                    { step: "Processed", timestamp: "2024-01-16", location: "Local Processing Plant" },
                    { step: "Quality Tested", timestamp: "2024-01-17", location: "Ethiopian Coffee Lab" },
                    { step: "Packaged", timestamp: "2024-01-18", location: "Addis Ababa Packaging Facility" },
                    { step: "Shipped", timestamp: "2024-01-20", location: "Ethiopian Port" }
                ]
            },
            {
                id: 2,
                productName: "Organic Quinoa",
                category: "Grains",
                origin: "Peru",
                description: "High-protein ancient grain perfect for healthy meals",
                price: "$12.99",
                qualityLevel: "Organic",
                certification: "USDA Organic",
                batchId: "PER-QUI-001",
                image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                supplyChainSteps: [
                    { step: "Harvested", timestamp: "2024-01-10", location: "Andes Mountains, Peru" },
                    { step: "Cleaned", timestamp: "2024-01-11", location: "Local Processing Facility" },
                    { step: "Quality Tested", timestamp: "2024-01-12", location: "Peruvian Agricultural Lab" },
                    { step: "Packaged", timestamp: "2024-01-13", location: "Lima Packaging Plant" },
                    { step: "Shipped", timestamp: "2024-01-15", location: "Callao Port" }
                ]
            }
        ];
        
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(mockProducts, null, 2));
    }
};

// GET /api/products - Get all products
router.get('/', async (req, res) => {
    try {
        await initializeProducts();
        const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
        const products = JSON.parse(data);
        
        // Filter by category if provided
        const { category, search } = req.query;
        let filteredProducts = products;
        
        if (category) {
            filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        
        if (search) {
            filteredProducts = filteredProducts.filter(p => 
                p.productName.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase()) ||
                p.origin.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        res.json({
            success: true,
            products: filteredProducts,
            total: filteredProducts.length
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
    try {
        await initializeProducts();
        const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
        const products = JSON.parse(data);
        
        const product = products.find(p => p.id === parseInt(req.params.id));
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product'
        });
    }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
    try {
        await initializeProducts();
        const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
        const products = JSON.parse(data);
        
        const newProduct = {
            id: Math.max(...products.map(p => p.id)) + 1,
            ...req.body,
            createdAt: new Date().toISOString()
        };
        
        products.push(newProduct);
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        
        res.status(201).json({
            success: true,
            product: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product'
        });
    }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
    try {
        await initializeProducts();
        const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
        const products = JSON.parse(data);
        
        const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
        
        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        products[productIndex] = {
            ...products[productIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        
        res.json({
            success: true,
            product: products[productIndex]
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product'
        });
    }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
    try {
        await initializeProducts();
        const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
        const products = JSON.parse(data);
        
        const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
        
        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const deletedProduct = products.splice(productIndex, 1)[0];
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        
        res.json({
            success: true,
            message: 'Product deleted successfully',
            product: deletedProduct
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product'
        });
    }
});

module.exports = router;
