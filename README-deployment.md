# Vesta DApp - Token Management with Locking

A complete DApp for ERC-20 token management with advanced locking mechanisms, built with React and Solidity.

## 🚀 Features

- **ERC-20 Token Contract**: Full-featured token with locking capabilities
- **Token Locking**: Lock tokens for specified periods (1 hour to 1 year)
- **Wallet Integration**: Connect and interact with Web3 wallets
- **Modern UI**: Beautiful, responsive interface with dark theme
- **Multi-Network Support**: Deploy on Sepolia, Goerli, or Mumbai testnets

## 📁 Project Structure

```
├── src/
│   ├── contracts/
│   │   └── VestaDappToken.sol    # Main ERC-20 contract with locking
│   ├── components/               # React components
│   └── pages/
├── scripts/
│   └── deploy.js                 # Deployment script
├── hardhat.config.js             # Hardhat configuration
└── README-deployment.md          # This file
```

## 🛠 Smart Contract Features

### VestaDappToken.sol
- **Standard ERC-20**: Transfer, approve, allowance functions
- **Token Locking**: Lock tokens for specified durations
- **Lock Management**: View active locks, unlock when ready
- **Balance Tracking**: Separate available vs locked balances
- **Events**: Comprehensive event logging for all operations

### Key Functions
```solidity
function lockTokens(uint256 amount, uint256 lockDurationInSeconds) external returns (uint256)
function unlockTokens(uint256 lockIndex) external
function getLockedBalance(address account) external view returns (uint256)
function getAvailableBalance(address account) external view returns (uint256)
```

## 🚀 Deployment Instructions

### Prerequisites
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
```

### Environment Setup
Create a `.env` file in the project root:
```env
PRIVATE_KEY=your_wallet_private_key_here
INFURA_API_KEY=your_infura_project_id_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

### Compile Contract
```bash
npx hardhat compile
```

### Deploy to Testnet

#### Sepolia (Ethereum)
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

#### Goerli (Ethereum)
```bash
npx hardhat run scripts/deploy.js --network goerli
```

#### Mumbai (Polygon)
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

### Verify Contract (Optional)
The deployment script automatically attempts to verify the contract on Etherscan/Polygonscan.

## 🌐 Frontend Integration

### Current Implementation
- **Simulated Wallet**: Demo wallet connection for testing
- **Mock Transactions**: All transactions are simulated
- **State Management**: React state for balances and locks

### Production Integration
To integrate with real wallets, replace the simulation with:

1. **Web3 Provider**: Use ethers.js or web3.js
2. **Wallet Connection**: MetaMask, WalletConnect, etc.
3. **Contract Interaction**: Replace mock functions with actual contract calls

Example Web3 integration:
```javascript
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);

// Lock tokens
await contract.lockTokens(amount, duration);
```

## 🎨 Design System

- **Dark Theme**: Professional crypto-focused design
- **Purple Gradients**: Modern Web3 aesthetic
- **Responsive**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects

## 🧪 Testing

### Run Local Tests
```bash
npx hardhat test
```

### Local Development
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

## 📊 Contract Details

- **Name**: Vesta Dapp Token
- **Symbol**: VDT
- **Decimals**: 18
- **Initial Supply**: 1,000,000 VDT
- **Lock Periods**: 1 hour to 1 year
- **Gas Optimized**: Efficient Solidity patterns

## 🔗 Testnet Resources

### Sepolia
- **Faucet**: https://sepoliafaucet.com/
- **Explorer**: https://sepolia.etherscan.io/

### Goerli
- **Faucet**: https://goerlifaucet.com/
- **Explorer**: https://goerli.etherscan.io/

### Mumbai
- **Faucet**: https://mumbaifaucet.com/
- **Explorer**: https://mumbai.polygonscan.com/

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Note**: This is a demonstration DApp. For production use, conduct thorough security audits and testing.