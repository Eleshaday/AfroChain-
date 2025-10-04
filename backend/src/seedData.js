const { initializeDatabase, createUser, addToCart } = require('./database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        console.log('Initializing database...');
        await initializeDatabase();

        console.log('Adding mock users...');
        
        // Create mock users
        const mockUsers = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123'
            },
            {
                name: 'Ahmed Hassan',
                email: 'ahmed@example.com',
                password: 'password123'
            },
            {
                name: 'Maria Garcia',
                email: 'maria@example.com',
                password: 'password123'
            }
        ];

        const createdUsers = [];
        for (const userData of mockUsers) {
            try {
                const user = await createUser(userData.name, userData.email, userData.password);
                createdUsers.push(user);
                console.log(`Created user: ${user.name} (${user.email})`);
            } catch (error) {
                if (error.message === 'Email already exists') {
                    console.log(`User ${userData.email} already exists, skipping...`);
                } else {
                    console.error(`Error creating user ${userData.email}:`, error);
                }
            }
        }

        console.log('Adding mock cart items...');
        
        // Add some cart items for the first user
        if (createdUsers.length > 0) {
            const userId = createdUsers[0].id;
            const cartItems = [
                {
                    coffeeType: 'Yirgacheffe Light Roast',
                    quantity: 2,
                    price: 24.99
                },
                {
                    coffeeType: 'Sidamo Medium Roast',
                    quantity: 1,
                    price: 19.99
                },
                {
                    coffeeType: 'Harrar Dark Roast',
                    quantity: 3,
                    price: 29.99
                }
            ];

            for (const item of cartItems) {
                try {
                    await addToCart(userId, item.coffeeType, item.quantity, item.price);
                    console.log(`Added ${item.quantity}x ${item.coffeeType} to cart`);
                } catch (error) {
                    console.error('Error adding cart item:', error);
                }
            }
        }

        console.log('Database seeding completed successfully!');
        console.log('\nMock users created:');
        createdUsers.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - ID: ${user.id}`);
        });
        
        console.log('\nYou can now test the API with these credentials:');
        console.log('Email: john@example.com, Password: password123');
        console.log('Email: jane@example.com, Password: password123');
        console.log('Email: ahmed@example.com, Password: password123');
        console.log('Email: maria@example.com, Password: password123');

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase };
