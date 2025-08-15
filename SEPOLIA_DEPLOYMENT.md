# Sepolia Testnet Deployment Guide

This guide will help you deploy your LockableToken contract to the Sepolia testnet.

## Prerequisites

1. **MetaMask Wallet** with Sepolia testnet configured
2. **Sepolia ETH** for gas fees (get from faucets below)
3. **API Keys** for Infura and Etherscan

## Step 1: Get Sepolia Test ETH

You'll need Sepolia ETH for gas fees. Get it from these faucets:

- **Alchemy Sepolia Faucet**: https://sepoliafaucet.com/
- **Infura Sepolia Faucet**: https://www.infura.io/faucet/sepolia
- **Chainlink Faucet**: https://faucets.chain.link/sepolia

## Step 2: Get API Keys

### Infura API Key
1. Go to https://infura.io/
2. Create an account and log in
3. Create a new project
4. Copy your project ID (this is your API key)

### Etherscan API Key
1. Go to https://etherscan.io/apis
2. Create an account and log in
3. Create a new API key
4. Copy your API key

## Step 3: Set Up Environment Variables

Create a `.env` file in your project root with the following content:

```env
# Sepolia Testnet Configuration
INFURA_API_KEY=your_infura_project_id_here
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### How to Get Your Private Key

⚠️ **WARNING**: Never share your private key or commit it to version control!

1. Open MetaMask
2. Go to Account Details (three dots menu)
3. Click "Export Private Key"
4. Enter your password
5. Copy the private key (without the 0x prefix)

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Compile Contracts

```bash
npx hardhat compile
```

## Step 6: Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Step 7: Verify Contract on Etherscan

The deployment script will automatically attempt to verify your contract on Etherscan. If it fails, you can manually verify:

1. Go to https://sepolia.etherscan.io/
2. Search for your contract address
3. Click "Contract" tab
4. Click "Verify and Publish"
5. Fill in the verification details:
   - Compiler Type: Solidity (Single file)
   - Compiler Version: 0.8.19
   - Open Source License Type: MIT
   - Constructor Arguments: `["Take Home Token", "THT", "1000000"]`

## Step 8: Test Your Contract

Run the test suite to ensure everything works:

```bash
npx hardhat test
```

## Contract Details

- **Token Name**: Take Home Token
- **Token Symbol**: THT
- **Initial Supply**: 1,000,000 tokens
- **Decimals**: 18
- **Features**: 
  - ERC-20 standard
  - Token locking mechanism
  - Reentrancy protection
  - Owner-only minting

## Useful Commands

```bash
# Check your Sepolia ETH balance
npx hardhat console --network sepolia
> const [signer] = await ethers.getSigners()
> const balance = await ethers.provider.getBalance(signer.address)
> ethers.utils.formatEther(balance)

# Get contract instance after deployment
> const LockableToken = await ethers.getContractFactory("LockableToken")
> const token = LockableToken.attach("YOUR_CONTRACT_ADDRESS")
> await token.name()
> await token.symbol()
> await token.totalSupply()
```

## Troubleshooting

### "Insufficient funds" error
- Get more Sepolia ETH from the faucets mentioned above

### "Invalid private key" error
- Make sure your private key doesn't include the "0x" prefix
- Ensure you're using the correct private key for the wallet with Sepolia ETH

### Contract verification fails
- Double-check your constructor arguments
- Ensure you're using the correct compiler version (0.8.19)
- Try manual verification on Etherscan

### Network connection issues
- Check your Infura API key
- Ensure you have a stable internet connection
- Try using a different RPC endpoint

## Next Steps

After successful deployment:

1. **Update your frontend** with the new contract address
2. **Test all functionality** on Sepolia testnet
3. **Document the contract address** for your team
4. **Consider upgrading** to mainnet when ready

## Security Notes

- Never commit your `.env` file to version control
- Use a dedicated wallet for testing, not your main wallet
- Keep your private keys secure and never share them
- Test thoroughly on testnet before mainnet deployment
