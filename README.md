# FarmerChain - Decentralized Agricultural Marketplace

FarmerChain is a blockchain-based agricultural marketplace that connects consumers directly with farmers, ensuring transparency, authenticity, and fair pricing through smart contracts and supply chain tracking.

## 🌾 Features

### Core Features
- **Wallet-Based Authentication**: Connect with MetaMask or HashPack wallets
- **Multi-Token Payments**: Support for ETH, HBAR, USDC, and USDT
- **Smart Escrow System**: Secure transactions with automated dispute resolution
- **Supply Chain Tracking**: Real-time tracking from farm to table
- **Product Authenticity**: Blockchain-verified product certificates
- **Loyalty System**: AGRITOKEN token rewards for customers
- **Delivery Tracking**: 5-stage delivery timeline with real-time updates

### Product Categories
- Coffee
- Grains
- Fruits
- Vegetables
- Spices
- Dairy
- Livestock

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/farmerchain.git
   cd farmerchain
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp backend/env.example backend/.env
   cp frontend/env.example frontend/.env
   
   # Edit the .env files with your configuration
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite
- **Styling**: CSS3 with CSS Variables
- **State Management**: React Hooks + LocalStorage
- **Wallet Integration**: Ethers.js for Ethereum, HashPack for Hedera
- **Icons**: FontAwesome 6.4.0

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Security**: Helmet.js, Rate Limiting, CORS
- **Authentication**: JWT with wallet signature verification
- **Database**: JSON files (products.json, transactions.json)
- **Blockchain**: Ethereum & Hedera integration

### Smart Contracts
- **Escrow Contract**: Automated payment handling
- **NFT Certificates**: Product authenticity verification
- **Token Contracts**: Loyalty rewards system

## 📁 Project Structure

```
farmerchain/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── data/            # Mock data and constants
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main application component
│   ├── public/              # Static assets
│   └── vite.config.js       # Vite configuration
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── authService.js   # Authentication logic
│   │   ├── blockchainService.js # Blockchain interactions
│   │   ├── productService.js # Product management
│   │   └── server.js        # Express server
│   ├── data/                # JSON database files
│   └── contracts/           # Smart contracts
└── contracts/               # Solidity smart contracts
    └── Escrow.sol           # Escrow contract
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=your-hedera-private-key
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
VITE_HEDERA_NETWORK=testnet
```

## 🔐 Security Features

- **Wallet Signature Verification**: All authentication uses cryptographic signatures
- **Rate Limiting**: API endpoints protected against abuse
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: All user inputs validated and sanitized
- **Helmet.js**: Security headers for XSS and CSRF protection
- **JWT Tokens**: Secure session management

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/wallet/authenticate` - Authenticate with wallet signature
- `POST /api/auth/wallet/message` - Generate authentication message
- `GET /api/auth/profile/:walletAddress` - Get user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Transactions
- `POST /api/process-payment` - Process payment
- `GET /api/transaction/:hash` - Get transaction details
- `POST /api/deploy` - Deploy escrow contract
- `POST /api/release` - Release funds to farmer
- `POST /api/refund` - Refund buyer

### Supply Chain
- `POST /api/supply-chain/create-topic` - Create tracking topic
- `POST /api/supply-chain/add-step` - Add supply chain step
- `GET /api/supply-chain/:batchId` - Get supply chain data

## 🎨 UI Components

### Core Components
- **Header**: Navigation with wallet connection
- **HomePage**: Hero section with integrated navbar
- **ProductsPage**: Product listing with search and filters
- **CartPage**: Shopping cart with modern design
- **CheckoutPage**: Payment processing with delivery address
- **DeliveryTracker**: Real-time delivery tracking
- **TransactionHistory**: Order history and tracking

### Design System
- **Color Scheme**: Green agricultural theme
- **Typography**: Inter font family
- **Layout**: Responsive grid system
- **Animations**: Smooth transitions and hover effects
- **Icons**: FontAwesome 6.4.0

## 🔄 User Flow

1. **Connect Wallet**: User connects MetaMask/HashPack wallet
2. **Browse Products**: Explore agricultural products by category
3. **Add to Cart**: Select products and quantities
4. **Checkout**: Enter delivery address and select payment method
5. **Payment**: Process payment with chosen token (ETH/HBAR/USDC/USDT)
6. **Track Delivery**: Monitor 5-stage delivery timeline
7. **Receive Products**: Complete transaction and rate experience

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
npm test
```

### Manual Testing Checklist
- [ ] Wallet connection works
- [ ] Product browsing and filtering
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Payment processing
- [ ] Delivery tracking
- [ ] Responsive design

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend Deployment (Railway/Heroku)
```bash
cd backend
# Configure environment variables
# Deploy with your preferred platform
```

### Environment Variables for Production
- Update API URLs to production endpoints
- Use production blockchain networks
- Configure proper CORS origins
- Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/yourusername/farmerchain/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/farmerchain/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/farmerchain/discussions)
- **Email**: support@farmerchain.com

## 🙏 Acknowledgments

- Ethereum Foundation for blockchain infrastructure
- Hedera Hashgraph for enterprise blockchain solutions
- React team for the amazing frontend framework
- All the farmers and agricultural communities worldwide

---

**Built with ❤️ for sustainable agriculture and fair trade**