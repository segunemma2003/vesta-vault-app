import { useReadContract, useWriteContract, useAccount, useChainId } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { VESTA_TOKEN_ABI } from '@/contracts/abi';
import { CONTRACT_ADDRESSES } from '@/lib/wagmi';

export const useTokenContract = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();

  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

  // Read token balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: VESTA_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Read available balance
  const { data: availableBalanceData, refetch: refetchAvailableBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: VESTA_TOKEN_ABI,
    functionName: 'getAvailableBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Read locked balance
  const { data: lockedBalanceData, refetch: refetchLockedBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: VESTA_TOKEN_ABI,
    functionName: 'getLockedBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Read lock count
  const { data: lockCountData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: VESTA_TOKEN_ABI,
    functionName: 'getLockCount',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Read all locks
  const { data: allLocksData, refetch: refetchLocks } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: VESTA_TOKEN_ABI,
    functionName: 'getAllLocks',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Parse balances to readable format (fallback to demo data if contract not deployed)
  const totalBalance = balanceData ? Number(formatUnits(balanceData, 18)) : 10000;
  const availableBalance = availableBalanceData ? Number(formatUnits(availableBalanceData, 18)) : 7500;
  const lockedBalance = lockedBalanceData ? Number(formatUnits(lockedBalanceData, 18)) : 2500;

  // Parse locks data (fallback to demo data if contract not deployed)
  const locks = allLocksData ? allLocksData[0].map((amount, index) => ({
    id: index,
    amount: Number(formatUnits(amount, 18)),
    unlockTime: new Date(Number(allLocksData[1][index]) * 1000),
    exists: allLocksData[2][index],
    duration: getDurationLabel(Number(allLocksData[1][index]) * 1000 - Date.now())
  })).filter(lock => lock.exists) : [
    {
      id: 1,
      amount: 1500,
      unlockTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      exists: true,
      duration: '1 Week'
    },
    {
      id: 2,
      amount: 1000,
      unlockTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      exists: true,
      duration: '1 Hour'
    }
  ];

  // Contract write functions
  const sendTokens = async (to: string, amount: number) => {
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      // Demo mode - just show success message
      return Promise.resolve();
    }
    
    return writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: VESTA_TOKEN_ABI,
      functionName: 'transfer',
      args: [to as `0x${string}`, parseUnits(amount.toString(), 18)],
    } as any);
  };

  const lockTokens = async (amount: number, duration: number) => {
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      // Demo mode - just show success message
      return Promise.resolve();
    }
    
    return writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: VESTA_TOKEN_ABI,
      functionName: 'lockTokens',
      args: [parseUnits(amount.toString(), 18), BigInt(duration)],
    } as any);
  };

  const unlockTokens = async (lockIndex: number) => {
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      // Demo mode - just show success message
      return Promise.resolve();
    }
    
    return writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: VESTA_TOKEN_ABI,
      functionName: 'unlockTokens',
      args: [BigInt(lockIndex)],
    } as any);
  };

  const refetchAll = () => {
    refetchBalance();
    refetchAvailableBalance();
    refetchLockedBalance();
    refetchLocks();
  };

  return {
    // Data
    totalBalance,
    availableBalance,
    lockedBalance,
    locks,
    contractAddress,
    isContractDeployed: contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    
    // Functions
    sendTokens,
    lockTokens,
    unlockTokens,
    refetchAll,
  };
};

// Helper function to get duration label
const getDurationLabel = (durationMs: number): string => {
  const seconds = Math.floor(durationMs / 1000);
  
  if (seconds <= 3600) return '1 Hour';
  if (seconds <= 86400) return '1 Day';
  if (seconds <= 604800) return '1 Week';
  if (seconds <= 2592000) return '1 Month';
  if (seconds <= 7776000) return '3 Months';
  if (seconds <= 15552000) return '6 Months';
  if (seconds <= 31536000) return '1 Year';
  
  return 'Custom';
};