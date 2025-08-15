import { useState } from 'react';
import { WalletConnect } from '@/components/WalletConnect';
import { TokenBalance } from '@/components/TokenBalance';
import { SendTokens } from '@/components/SendTokens';
import { LockTokens } from '@/components/LockTokens';
import { ActiveLocks } from '@/components/ActiveLocks';
import { DeploymentGuide } from '@/components/DeploymentGuide';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Zap } from 'lucide-react';

interface Lock {
  id: number;
  amount: number;
  unlockTime: Date;
  duration: string;
}

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [totalBalance, setTotalBalance] = useState(10000);
  const [lockedBalance, setLockedBalance] = useState(2500);
  const [activeLocks, setActiveLocks] = useState<Lock[]>([
    {
      id: 1,
      amount: 1500,
      unlockTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: '1 Week'
    },
    {
      id: 2,
      amount: 1000,
      unlockTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago (unlockable)
      duration: '1 Hour'
    }
  ]);

  const availableBalance = totalBalance - lockedBalance;
  const isConnected = !!walletAddress;

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleSendTokens = (to: string, amount: number) => {
    setTotalBalance(prev => prev - amount);
  };

  const handleLockTokens = (amount: number, duration: number) => {
    const durationLabels: { [key: number]: string } = {
      3600: '1 Hour',
      86400: '1 Day',
      604800: '1 Week',
      2592000: '1 Month',
      7776000: '3 Months',
      15552000: '6 Months',
      31536000: '1 Year'
    };

    const newLock: Lock = {
      id: Date.now(),
      amount,
      unlockTime: new Date(Date.now() + duration * 1000),
      duration: durationLabels[duration] || 'Custom'
    };

    setActiveLocks(prev => [...prev, newLock]);
    setLockedBalance(prev => prev + amount);
  };

  const handleUnlockTokens = (lockId: number) => {
    const lock = activeLocks.find(l => l.id === lockId);
    if (lock) {
      setActiveLocks(prev => prev.filter(l => l.id !== lockId));
      setLockedBalance(prev => prev - lock.amount);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Vesta DApp
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A decentralized token management platform with advanced locking mechanisms
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="max-w-md mx-auto mb-8">
          <WalletConnect 
            onConnect={handleWalletConnect}
            isConnected={isConnected}
            address={walletAddress}
          />
        </div>

        {isConnected && (
          <>
            {/* Token Balance */}
            <div className="mb-8">
              <TokenBalance 
                totalBalance={totalBalance}
                availableBalance={availableBalance}
                lockedBalance={lockedBalance}
              />
            </div>

            {/* Main Interface */}
            <Tabs defaultValue="send" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="send" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Send
                </TabsTrigger>
                <TabsTrigger value="lock" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Lock
                </TabsTrigger>
                <TabsTrigger value="locks">Active Locks</TabsTrigger>
                <TabsTrigger value="deploy">Deploy</TabsTrigger>
              </TabsList>

              <TabsContent value="send">
                <SendTokens 
                  availableBalance={availableBalance}
                  onSend={handleSendTokens}
                />
              </TabsContent>

              <TabsContent value="lock">
                <LockTokens 
                  availableBalance={availableBalance}
                  onLock={handleLockTokens}
                />
              </TabsContent>

              <TabsContent value="locks">
                <ActiveLocks 
                  locks={activeLocks}
                  onUnlock={handleUnlockTokens}
                />
              </TabsContent>

              <TabsContent value="deploy">
                <DeploymentGuide />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;