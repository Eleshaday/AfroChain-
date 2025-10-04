import React, { useState } from 'react';

export default function FarmerPost({ onAddProduct }) {
    const [formData, setFormData] = useState({
        farmerName: '',
        coffeeName: '',
        origin: '',
        roastLevel: 'Green (Unroasted)',
        description: '',
        price: '',
        available: '',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.farmerName || !formData.coffeeName || !formData.origin || 
            !formData.description || !formData.price || !formData.available) {
            alert('Please fill in all required fields');
            return;
        }

        // Add the new product
        onAddProduct(formData);
        
        // Reset form
        setFormData({
            farmerName: '',
            coffeeName: '',
            origin: '',
            roastLevel: 'Green (Unroasted)',
            description: '',
            price: '',
            available: '',
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'
        });
        
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div className="farmer-post">
            <h1 style={{ 
                fontSize: '2.5rem', 
                textAlign: 'center', 
                marginBottom: '2rem', 
                color: '#2c1810' 
            }}>
                Post Your Coffee Product
            </h1>
            
            <p style={{ 
                textAlign: 'center', 
                marginBottom: '2rem', 
                color: '#666',
                fontSize: '1.1rem'
            }}>
                Share your premium coffee beans with coffee enthusiasts worldwide
            </p>

            {isSubmitted && (
                <div style={{
                    background: '#d4edda',
                    color: '#155724',
                    padding: '1rem',
                    borderRadius: '5px',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    border: '1px solid #c3e6cb'
                }}>
                    ✅ Product posted successfully! Your coffee is now available for purchase.
                </div>
            )}

            <div className="post-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="farmerName">Farm/Producer Name *</label>
                        <input
                            type="text"
                            id="farmerName"
                            name="farmerName"
                            value={formData.farmerName}
                            onChange={handleInputChange}
                            placeholder="e.g., Ethiopian Highlands Farm"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="coffeeName">Coffee Name *</label>
                        <input
                            type="text"
                            id="coffeeName"
                            name="coffeeName"
                            value={formData.coffeeName}
                            onChange={handleInputChange}
                            placeholder="e.g., Yirgacheffe Green Beans"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="origin">Origin Country/Region *</label>
                        <input
                            type="text"
                            id="origin"
                            name="origin"
                            value={formData.origin}
                            onChange={handleInputChange}
                            placeholder="e.g., Ethiopia, Colombia, Kenya"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="roastLevel">Roast Level</label>
                        <select
                            id="roastLevel"
                            name="roastLevel"
                            value={formData.roastLevel}
                            onChange={handleInputChange}
                        >
                            <option value="Green (Unroasted)">Green (Unroasted)</option>
                            <option value="Light Roast">Light Roast</option>
                            <option value="Medium Roast">Medium Roast</option>
                            <option value="Dark Roast">Dark Roast</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe the coffee's flavor profile, processing method, altitude, etc."
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label htmlFor="price">Price per lb *</label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="e.g., $12.50"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="available">Available Quantity (lbs) *</label>
                            <input
                                type="number"
                                id="available"
                                name="available"
                                value={formData.available}
                                onChange={handleInputChange}
                                placeholder="e.g., 50"
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Image URL</label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="https://example.com/coffee-image.jpg"
                        />
                        <small style={{ color: '#666', fontSize: '0.9rem' }}>
                            Leave empty to use default coffee image
                        </small>
                    </div>

                    <button type="submit" className="submit-button">
                        Post Coffee Product
                    </button>
                </form>
            </div>

            {/* Tips Section */}
            <div style={{
                background: '#f8f9fa',
                padding: '2rem',
                borderRadius: '10px',
                marginTop: '2rem',
                border: '1px solid #e9ecef'
            }}>
                <h3 style={{ color: '#8B4513', marginBottom: '1rem' }}>💡 Tips for Better Listings</h3>
                <ul style={{ color: '#666', lineHeight: '1.6' }}>
                    <li>Include detailed flavor notes and processing methods</li>
                    <li>Mention the altitude and growing conditions</li>
                    <li>Highlight any certifications (organic, fair trade, etc.)</li>
                    <li>Use high-quality images of your coffee beans</li>
                    <li>Set competitive prices based on market rates</li>
                </ul>
            </div>
        </div>
    );
}
