import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTokenContract } from '@/hooks/useTokenContract';
import { useReadContract } from 'wagmi';
import { LOCKABLE_TOKEN_ABI } from '@/contracts/abi';
import { CONTRACT_ADDRESSES } from '@/lib/wagmi';
import { useChainId } from 'wagmi';
import { Copy, ExternalLink, Shield, Coins, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ContractInfo = () => {
  const chainId = useChainId();
  const { toast } = useToast();
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  const { isContractDeployed } = useTokenContract();

  // Read contract information
  const { data: tokenName } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LOCKABLE_TOKEN_ABI,
    functionName: 'name',
    query: { enabled: isContractDeployed },
  });

  const { data: tokenSymbol } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LOCKABLE_TOKEN_ABI,
    functionName: 'symbol',
    query: { enabled: isContractDeployed },
  });

  const { data: totalSupply } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LOCKABLE_TOKEN_ABI,
    functionName: 'totalSupply',
    query: { enabled: isContractDeployed },
  });

  const { data: decimals } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LOCKABLE_TOKEN_ABI,
    functionName: 'decimals',
    query: { enabled: isContractDeployed },
  });

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    toast({
      title: "Copied!",
      description: "Contract address copied to clipboard",
    });
  };

  const getExplorerUrl = () => {
    switch (chainId) {
      case 11155111: // Sepolia
        return `https://sepolia.etherscan.io/address/${contractAddress}`;
      case 5: // Goerli
        return `https://goerli.etherscan.io/address/${contractAddress}`;
      case 80001: // Mumbai
        return `https://mumbai.polygonscan.com/address/${contractAddress}`;
      default:
        return `https://etherscan.io/address/${contractAddress}`;
    }
  };

  const formatTotalSupply = () => {
    if (!totalSupply || !decimals) return '0';
    return (Number(totalSupply) / Math.pow(10, Number(decimals))).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Contract Information
        </CardTitle>
        <CardDescription>
          Details about the deployed smart contract
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge variant={isContractDeployed ? "default" : "secondary"}>
              {isContractDeployed ? "Deployed" : "Not Deployed"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Token Name</span>
            <span className="text-sm text-muted-foreground">
              {tokenName || "Not Available"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Token Symbol</span>
            <span className="text-sm text-muted-foreground">
              {tokenSymbol || "Not Available"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Supply</span>
            <span className="text-sm text-muted-foreground">
              {formatTotalSupply()} THT
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Decimals</span>
            <span className="text-sm text-muted-foreground">
              {decimals || "Not Available"}
            </span>
          </div>
        </div>

        {isContractDeployed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Contract Address</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open(getExplorerUrl(), '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="w-4 h-4" />
            <span>ERC-20 Standard</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Token Locking</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Multi-lock Support</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
