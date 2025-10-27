const fs = require('fs-extra');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DB_PATH, 'products.json');

// Product categories
const PRODUCT_CATEGORIES = {
    'Coffee': {
        name: 'Coffee',
        icon: '☕',
        subcategories: ['Green Beans', 'Roasted Beans', 'Ground Coffee', 'Instant Coffee'],
        description: 'Premium coffee beans and products from around the world'
    },
    'Grains': {
        name: 'Grains',
        icon: '🌾',
        subcategories: ['Wheat', 'Rice', 'Corn', 'Barley', 'Oats', 'Quinoa'],
        description: 'High-quality grains and cereals'
    },
    'Vegetables': {
        name: 'Vegetables',
        icon: '🥬',
        subcategories: ['Leafy Greens', 'Root Vegetables', 'Tomatoes', 'Peppers', 'Onions'],
        description: 'Fresh vegetables from local farms'
    },
    'Fruits': {
        name: 'Fruits',
        icon: '🍎',
        subcategories: ['Citrus', 'Tropical', 'Berries', 'Stone Fruits', 'Apples'],
        description: 'Fresh fruits from sustainable farms'
    },
    'Livestock': {
        name: 'Livestock',
        icon: '🐄',
        subcategories: ['Cattle', 'Sheep', 'Goats', 'Poultry', 'Pigs'],
        description: 'Healthy livestock and animal products'
    },
    'Dairy & Bee Products': {
        name: 'Dairy & Bee Products',
        icon: '🥛',
        subcategories: ['Milk', 'Cheese', 'Yogurt', 'Honey', 'Beeswax'],
        description: 'Fresh dairy and bee products'
    },
    'Spices & Herbs': {
        name: 'Spices & Herbs',
        icon: '🌿',
        subcategories: ['Dried Spices', 'Fresh Herbs', 'Tea Leaves', 'Medicinal Herbs'],
        description: 'Aromatic spices and medicinal herbs'
    },
    'Nuts & Seeds': {
        name: 'Nuts & Seeds',
        icon: '🥜',
        subcategories: ['Tree Nuts', 'Ground Nuts', 'Seeds', 'Dried Fruits'],
        description: 'Nutritious nuts and seeds'
    }
};

async function ensureDb() {
    await fs.ensureDir(DB_PATH);
    if (!(await fs.pathExists(PRODUCTS_FILE))) {
        await fs.writeJson(PRODUCTS_FILE, { products: [] }, { spaces: 2 });
    }
}

async function readProducts() {
    await ensureDb();
    const data = await fs.readJson(PRODUCTS_FILE);
    return data.products || [];
}

async function writeProducts(products) {
    await ensureDb();
    await fs.writeJson(PRODUCTS_FILE, { products }, { spaces: 2 });
}

// Get all product categories
function getProductCategories() {
    return PRODUCT_CATEGORIES;
}

// Get products by category
async function getProductsByCategory(category) {
    const products = await readProducts();
    return products.filter(product => product.category === category);
}

// Get products by farmer
async function getProductsByFarmer(farmerWalletAddress) {
    const products = await readProducts();
    return products.filter(product => product.farmerWalletAddress === farmerWalletAddress);
}

// Create a new product
async function createProduct(productData) {
    try {
        const products = await readProducts();
        
        // Validate required fields
        if (!productData.productName || !productData.category || !productData.farmerWalletAddress) {
            return { success: false, error: 'Product name, category, and farmer wallet address are required' };
        }

        // Validate category
        if (!PRODUCT_CATEGORIES[productData.category]) {
            return { success: false, error: 'Invalid product category' };
        }

        const newProduct = {
            id: Date.now().toString(),
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
            views: 0,
            sales: 0
        };

        products.push(newProduct);
        await writeProducts(products);

        return { success: true, product: newProduct };
    } catch (error) {
        console.error('Create product error:', error);
        return { success: false, error: 'Failed to create product' };
    }
}

// Update a product
async function updateProduct(productId, updateData) {
    try {
        const products = await readProducts();
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return { success: false, error: 'Product not found' };
        }

        // Validate category if provided
        if (updateData.category && !PRODUCT_CATEGORIES[updateData.category]) {
            return { success: false, error: 'Invalid product category' };
        }

        products[productIndex] = {
            ...products[productIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        await writeProducts(products);

        return { success: true, product: products[productIndex] };
    } catch (error) {
        console.error('Update product error:', error);
        return { success: false, error: 'Failed to update product' };
    }
}

// Delete a product
async function deleteProduct(productId) {
    try {
        const products = await readProducts();
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return { success: false, error: 'Product not found' };
        }

        products.splice(productIndex, 1);
        await writeProducts(products);

        return { success: true };
    } catch (error) {
        console.error('Delete product error:', error);
        return { success: false, error: 'Failed to delete product' };
    }
}

// Get a single product by ID
async function getProductById(productId) {
    try {
        const products = await readProducts();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        return { success: true, product };
    } catch (error) {
        console.error('Get product error:', error);
        return { success: false, error: 'Failed to get product' };
    }
}

// Search products
async function searchProducts(query, filters = {}) {
    try {
        const products = await readProducts();
        let filteredProducts = products.filter(product => product.isActive);

        // Text search
        if (query) {
            const searchTerm = query.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.productName.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.origin.toLowerCase().includes(searchTerm) ||
                product.farmerName.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        if (filters.category) {
            filteredProducts = filteredProducts.filter(product => product.category === filters.category);
        }

        // Subcategory filter
        if (filters.subcategory) {
            filteredProducts = filteredProducts.filter(product => product.subcategory === filters.subcategory);
        }

        // Price range filter
        if (filters.minPrice || filters.maxPrice) {
            filteredProducts = filteredProducts.filter(product => {
                const price = parseFloat(product.price.replace('$', ''));
                if (filters.minPrice && price < filters.minPrice) return false;
                if (filters.maxPrice && price > filters.maxPrice) return false;
                return true;
            });
        }

        // Certification filter
        if (filters.certification) {
            filteredProducts = filteredProducts.filter(product => 
                product.certification === filters.certification
            );
        }

        return { success: true, products: filteredProducts };
    } catch (error) {
        console.error('Search products error:', error);
        return { success: false, error: 'Failed to search products' };
    }
}

module.exports = {
    getProductCategories,
    getProductsByCategory,
    getProductsByFarmer,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    searchProducts,
    readProducts,
    writeProducts
};
