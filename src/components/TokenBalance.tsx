import { Card } from '@/components/ui/card';
import { Coins, Lock, Unlock } from 'lucide-react';

interface TokenBalanceProps {
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number;
}

export const TokenBalance = ({ totalBalance, availableBalance, lockedBalance }: TokenBalanceProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-gradient-card border border-border">
        <div className="flex items-center gap-3">
          <Coins className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="text-2xl font-bold">{totalBalance.toLocaleString()} VDT</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card border border-border">
        <div className="flex items-center gap-3">
          <Unlock className="w-8 h-8 text-success" />
          <div>
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="text-2xl font-bold text-success">{availableBalance.toLocaleString()} VDT</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card border border-border">
        <div className="flex items-center gap-3">
          <Lock className="w-8 h-8 text-warning" />
          <div>
            <p className="text-sm text-muted-foreground">Locked</p>
            <p className="text-2xl font-bold text-warning">{lockedBalance.toLocaleString()} VDT</p>
          </div>
        </div>
      </Card>
    </div>
  );
};