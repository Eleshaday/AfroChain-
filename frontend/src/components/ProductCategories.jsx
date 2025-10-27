import React, { useState, useEffect } from 'react';

export default function ProductCategories({ onCategorySelect, selectedCategory }) {
    const [categories, setCategories] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/products/categories');
            const data = await response.json();
            
            if (data.success) {
                setCategories(data.categories);
            } else {
                console.error('Failed to fetch categories:', data.error);
                // Fallback to hardcoded categories
                setCategories({
                    'Coffee': { name: 'Coffee', icon: '☕', subcategories: ['Green Beans', 'Roasted Beans'], description: 'Premium coffee products' },
                    'Grains': { name: 'Grains', icon: '🌾', subcategories: ['Wheat', 'Rice', 'Corn'], description: 'High-quality grains' },
                    'Vegetables': { name: 'Vegetables', icon: '🥬', subcategories: ['Leafy Greens', 'Root Vegetables'], description: 'Fresh vegetables' },
                    'Fruits': { name: 'Fruits', icon: '🍎', subcategories: ['Citrus', 'Tropical', 'Berries'], description: 'Fresh fruits' },
                    'Livestock': { name: 'Livestock', icon: '🐄', subcategories: ['Cattle', 'Sheep', 'Poultry'], description: 'Healthy livestock' },
                    'Dairy & Bee Products': { name: 'Dairy & Bee Products', icon: '🥛', subcategories: ['Milk', 'Cheese', 'Honey'], description: 'Dairy and bee products' }
                });
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to hardcoded categories
            setCategories({
                'Coffee': { name: 'Coffee', icon: '☕', subcategories: ['Green Beans', 'Roasted Beans'], description: 'Premium coffee products' },
                'Grains': { name: 'Grains', icon: '🌾', subcategories: ['Wheat', 'Rice', 'Corn'], description: 'High-quality grains' },
                'Vegetables': { name: 'Vegetables', icon: '🥬', subcategories: ['Leafy Greens', 'Root Vegetables'], description: 'Fresh vegetables' },
                'Fruits': { name: 'Fruits', icon: '🍎', subcategories: ['Citrus', 'Tropical', 'Berries'], description: 'Fresh fruits' },
                'Livestock': { name: 'Livestock', icon: '🐄', subcategories: ['Cattle', 'Sheep', 'Poultry'], description: 'Healthy livestock' },
                'Dairy & Bee Products': { name: 'Dairy & Bee Products', icon: '🥛', subcategories: ['Milk', 'Cheese', 'Honey'], description: 'Dairy and bee products' }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const categoryList = [
        { name: 'All Products', icon: '🌍', key: '' },
        ...Object.entries(categories).map(([key, category]) => ({
            name: category.name,
            icon: category.icon,
            key: key
        }))
    ];

    if (isLoading) {
        return (
            <div className="product-categories">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                    <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="product-categories">
            {categoryList.map(category => (
                <button
                    key={category.key}
                    onClick={() => onCategorySelect(category.key)}
                    className={`category-btn ${selectedCategory === category.key ? 'active' : ''}`}
                >
                    <span>{category.icon}</span>
                    {category.name}
                </button>
            ))}
        </div>
    );
}