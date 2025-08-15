import { createConfig, http } from 'wagmi';
import { sepolia, goerli, polygonMumbai } from 'wagmi/chains';
import { metaMask, walletConnect, injected } from 'wagmi/connectors';

// Contract addresses - update these after deployment
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: '0x0000000000000000000000000000000000000000', // Update after deployment
  [goerli.id]: '0x0000000000000000000000000000000000000000', // Update after deployment
  [polygonMumbai.id]: '0x0000000000000000000000000000000000000000', // Update after deployment
} as const;

export const config = createConfig({
  chains: [sepolia, goerli, polygonMumbai],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: 'your-walletconnect-project-id', // Get from walletconnect.com
    }),
    injected(),
  ],
  transports: {
    [sepolia.id]: http(),
    [goerli.id]: http(),
    [polygonMumbai.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}