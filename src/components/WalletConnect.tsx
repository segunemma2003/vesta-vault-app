import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  isConnected: boolean;
  address: string | null;
}

export const WalletConnect = ({ onConnect, isConnected, address }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      onConnect(mockAddress);
      setIsConnecting(false);
      toast.success('Wallet connected successfully!');
    }, 1500);
  };

  if (isConnected && address) {
    return (
      <Card className="p-4 bg-gradient-card border border-border">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-success" />
          <div>
            <p className="text-sm text-muted-foreground">Connected Wallet</p>
            <p className="font-mono text-sm">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border border-border text-center">
      <Wallet className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
      <p className="text-muted-foreground mb-4">
        Connect your wallet to interact with the Vesta DApp
      </p>
      <Button 
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    </Card>
  );
};