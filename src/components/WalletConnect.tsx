import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, CheckCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      const connector = connectors[0]; // Use first available connector (MetaMask)
      connect({ connector });
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  if (isConnected && address) {
    return (
      <Card className="p-4 bg-gradient-card border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Connected Wallet</p>
              <p className="font-mono text-sm">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
          </Button>
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
        disabled={isPending}
        className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
      >
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    </Card>
  );
};