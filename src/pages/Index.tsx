import { useTokenContract } from '@/hooks/useTokenContract';
import { WalletConnect } from '@/components/WalletConnect';
import { TokenBalance } from '@/components/TokenBalance';
import { SendTokens } from '@/components/SendTokens';
import { LockTokens } from '@/components/LockTokens';
import { ActiveLocks } from '@/components/ActiveLocks';
import { DeploymentGuide } from '@/components/DeploymentGuide';
import { ContractInfo } from '@/components/ContractInfo';
import { MintTokens } from '@/components/MintTokens';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Zap, Crown, Info } from 'lucide-react';
import { useAccount } from 'wagmi';

const Index = () => {
  const { isConnected } = useAccount();
  const { 
    totalBalance, 
    availableBalance, 
    lockedBalance, 
    locks, 
    sendTokens, 
    lockTokens, 
    unlockTokens,
    refetchAll,
    isContractDeployed 
  } = useTokenContract();

  const handleSendTokens = async (to: string, amount: number) => {
    try {
      await sendTokens(to, amount);
      refetchAll();
    } catch (error) {
      console.error('Send failed:', error);
    }
  };

  const handleLockTokens = async (amount: number, duration: number) => {
    try {
      await lockTokens(amount, duration);
      refetchAll();
    } catch (error) {
      console.error('Lock failed:', error);
    }
  };

  const handleUnlockTokens = async (lockId: number) => {
    try {
      await unlockTokens(lockId);
      refetchAll();
    } catch (error) {
      console.error('Unlock failed:', error);
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
              Take Home DApp
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A decentralized token management platform with advanced locking mechanisms
          </p>
          {!isContractDeployed && (
            <p className="text-sm text-warning mt-2">
              Connect wallet and deploy contract to start using the DApp
            </p>
          )}
        </div>

        {/* Wallet Connection */}
        <div className="max-w-md mx-auto mb-8">
          <WalletConnect />
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
            <Tabs defaultValue="send" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-6 mb-8">
                <TabsTrigger value="send" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Send
                </TabsTrigger>
                <TabsTrigger value="lock" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Lock
                </TabsTrigger>
                <TabsTrigger value="locks">Active Locks</TabsTrigger>
                <TabsTrigger value="mint" className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Mint
                </TabsTrigger>
                <TabsTrigger value="info" className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Info
                </TabsTrigger>
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
                  locks={locks}
                  onUnlock={handleUnlockTokens}
                />
              </TabsContent>

              <TabsContent value="mint">
                <MintTokens onMint={refetchAll} />
              </TabsContent>

              <TabsContent value="info">
                <ContractInfo />
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