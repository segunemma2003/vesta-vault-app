import { useReadContract, useWriteContract, useAccount, useChainId } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { LOCKABLE_TOKEN_ABI } from '@/contracts/abi';
import { CONTRACT_ADDRESSES } from '@/lib/wagmi';

export const useTokenContract = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();

  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

  // Read token balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LOCKABLE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Read available balance
  const { data: availableBalanceData, refetch: refetchAvailableBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LOCKABLE_TOKEN_ABI,
    functionName: 'getAvailableBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Read locked balance
  const { data: lockedBalanceData, refetch: refetchLockedBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LOCKABLE_TOKEN_ABI,
    functionName: 'getTotalLockedTokens',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Read lock count
  const { data: lockCountData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LOCKABLE_TOKEN_ABI,
    functionName: 'getLockCount',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Read active locks
  const { data: activeLocksData, refetch: refetchLocks } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: LOCKABLE_TOKEN_ABI,
    functionName: 'getActiveLocks',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Parse balances to readable format (only real contract data)
  const totalBalance = balanceData ? Number(formatUnits(balanceData, 18)) : 0;
  const availableBalance = availableBalanceData ? Number(formatUnits(availableBalanceData, 18)) : 0;
  const lockedBalance = lockedBalanceData ? Number(formatUnits(lockedBalanceData, 18)) : 0;

  // Parse locks data (only real contract data)
  const locks = activeLocksData ? activeLocksData[0].map((amount, index) => ({
    id: Number(activeLocksData[2][index]), // Use the actual lock index
    amount: Number(formatUnits(amount, 18)),
    unlockTime: new Date(Number(activeLocksData[1][index]) * 1000),
    exists: true,
    duration: getDurationLabel(Number(activeLocksData[1][index]) * 1000 - Date.now())
  })) : [];

  // Contract write functions
  const sendTokens = async (to: string, amount: number) => {
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed');
    }
    
    return writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: LOCKABLE_TOKEN_ABI,
      functionName: 'transfer',
      args: [to as `0x${string}`, parseUnits(amount.toString(), 18)],
    } as any);
  };

  const lockTokens = async (amount: number, duration: number) => {
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed');
    }
    
    return writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: LOCKABLE_TOKEN_ABI,
      functionName: 'lockTokens',
      args: [parseUnits(amount.toString(), 18), BigInt(duration)],
    } as any);
  };

  const unlockTokens = async (lockIndex: number) => {
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed');
    }
    
    return writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: LOCKABLE_TOKEN_ABI,
      functionName: 'unlockTokens',
      args: [BigInt(lockIndex)],
    } as any);
  };

  const mintTokens = async (to: string, amount: number) => {
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed');
    }
    
    return writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: LOCKABLE_TOKEN_ABI,
      functionName: 'mint',
      args: [to as `0x${string}`, parseUnits(amount.toString(), 18)],
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
    mintTokens,
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