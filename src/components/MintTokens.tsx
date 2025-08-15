import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { useTokenContract } from '@/hooks/useTokenContract';
import { parseUnits } from 'viem';
import { Crown, Coins } from 'lucide-react';

interface MintTokensProps {
  onMint?: () => void;
}

export const MintTokens = ({ onMint }: MintTokensProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { address } = useAccount();
  const { contractAddress, isContractDeployed, mintTokens } = useTokenContract();

  const handleMint = async () => {
    if (!recipient || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!isContractDeployed) {
      toast({
        title: "Contract Not Deployed",
        description: "Please deploy the contract first to use this feature",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await mintTokens(recipient, Number(amount));
      toast({
        title: "Success",
        description: `Minted ${amount} THT to ${recipient}`,
      });
      setRecipient('');
      setAmount('');
      onMint?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mint tokens",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Mint Tokens (Owner Only)
        </CardTitle>
        <CardDescription>
          Mint new tokens to any address. Only the contract owner can perform this action.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (THT)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleMint} 
          disabled={isLoading || !recipient || !amount}
          className="w-full"
        >
          <Coins className="w-4 h-4 mr-2" />
          {isLoading ? 'Minting...' : 'Mint Tokens'}
        </Button>

        {!isContractDeployed && (
          <p className="text-sm text-muted-foreground text-center">
            Deploy contract to enable minting functionality
          </p>
        )}
      </CardContent>
    </Card>
  );
};
