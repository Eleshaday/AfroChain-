const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '..', 'chakka_coffee.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Create users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating users table:', err);
                    reject(err);
                } else {
                    console.log('Users table created successfully');
                }
            });

            // Create coffee_orders table
            db.run(`
                CREATE TABLE IF NOT EXISTS coffee_orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    coffee_type TEXT NOT NULL,
                    quantity INTEGER NOT NULL,
                    price DECIMAL(10,2) NOT NULL,
                    status TEXT DEFAULT 'pending',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating coffee_orders table:', err);
                    reject(err);
                } else {
                    console.log('Coffee orders table created successfully');
                }
            });

            // Create cart table
            db.run(`
                CREATE TABLE IF NOT EXISTS cart (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    coffee_type TEXT NOT NULL,
                    quantity INTEGER NOT NULL,
                    price DECIMAL(10,2) NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating cart table:', err);
                    reject(err);
                } else {
                    console.log('Cart table created successfully');
                    resolve();
                }
            });
        });
    });
};

// User operations
const createUser = async (name, email, password) => {
    return new Promise((resolve, reject) => {
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        db.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                        reject(new Error('Email already exists'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({
                        id: this.lastID,
                        name,
                        email,
                        created_at: new Date().toISOString()
                    });
                }
            }
        );
    });
};

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
};

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
};

const verifyPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};

// Cart operations
const addToCart = (userId, coffeeType, quantity, price) => {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO cart (user_id, coffee_type, quantity, price) VALUES (?, ?, ?, ?)',
            [userId, coffeeType, quantity, price],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        user_id: userId,
                        coffee_type: coffeeType,
                        quantity,
                        price
                    });
                }
            }
        );
    });
};

const getCartItems = (userId) => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM cart WHERE user_id = ?',
            [userId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
};

const clearCart = (userId) => {
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM cart WHERE user_id = ?',
            [userId],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            }
        );
    });
};

// Close database connection
const closeDatabase = () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
    });
};

module.exports = {
    initializeDatabase,
    createUser,
    getUserByEmail,
    getUserById,
    verifyPassword,
    addToCart,
    getCartItems,
    clearCart,
    closeDatabase
};
