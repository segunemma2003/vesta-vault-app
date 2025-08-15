import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, ExternalLink, Github } from 'lucide-react';

export const DeploymentGuide = () => {
  return (
    <Card className="p-6 bg-gradient-card border border-border">
      <div className="flex items-center gap-3 mb-6">
        <Code className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">Smart Contract & Deployment</h3>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Github className="w-4 h-4" />
            Contract Files
          </h4>
          <div className="bg-background/50 rounded-lg p-4 font-mono text-sm">
            <p className="text-muted-foreground mb-2">Smart Contract Location:</p>
            <p className="text-primary">src/contracts/VestaDappToken.sol</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Deployment Instructions</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium">Install Hardhat</p>
                <code className="text-xs bg-background/50 px-2 py-1 rounded">npm install --save-dev hardhat</code>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium">Configure Network</p>
                <p className="text-muted-foreground">Add Sepolia/Goerli testnet to hardhat.config.js</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium">Deploy Contract</p>
                <code className="text-xs bg-background/50 px-2 py-1 rounded">npx hardhat run scripts/deploy.js --network sepolia</code>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <div>
                <p className="font-medium">Update Frontend</p>
                <p className="text-muted-foreground">Replace contract address and add Web3 integration</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Testnet Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="font-medium text-sm">Sepolia</p>
              <p className="text-xs text-muted-foreground">Ethereum testnet</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="font-medium text-sm">Goerli</p>
              <p className="text-xs text-muted-foreground">Ethereum testnet</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="font-medium text-sm">Mumbai</p>
              <p className="text-xs text-muted-foreground">Polygon testnet</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-warning-foreground">
            <strong>Note:</strong> This is a demo interface. To deploy to mainnet, replace the simulated wallet 
            connections with actual Web3 providers like MetaMask, and update contract addresses.
          </p>
        </div>
      </div>
    </Card>
  );
};