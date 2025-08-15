# Take Home DApp - Token Management & Locking Platform

## Project Overview

A comprehensive ERC-20 token management DApp with advanced locking mechanisms, built for Ethereum testnets.

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

Clone this repo and work locally with your preferred development environment.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Smart Contract Deployment

### Deploy to Sepolia Testnet

This project includes a LockableToken ERC-20 contract that can be deployed to the Sepolia testnet.

1. **Set up environment variables** (see `SEPOLIA_DEPLOYMENT.md` for detailed instructions):
   ```bash
   # Create .env file with your API keys
   INFURA_API_KEY=your_infura_project_id
   PRIVATE_KEY=your_wallet_private_key
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

2. **Get Sepolia test ETH** from faucets:
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

3. **Deploy the contract**:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Verify on Etherscan**:
   - The deployment script will attempt automatic verification
   - Manual verification: https://sepolia.etherscan.io/

For detailed deployment instructions, see [SEPOLIA_DEPLOYMENT.md](./SEPOLIA_DEPLOYMENT.md).

## Frontend Deployment

You can deploy the frontend to any static hosting service like Vercel, Netlify, or GitHub Pages.

```sh
# Build the project for production
npm run build

# The built files will be in the 'dist' directory
```

### Deployment Options

- **Vercel**: Connect your GitHub repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect your repository
- **GitHub Pages**: Use GitHub Actions to build and deploy automatically
