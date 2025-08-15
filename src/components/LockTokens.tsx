import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

interface LockTokensProps {
  availableBalance: number;
  onLock: (amount: number, duration: number) => Promise<void>;
}

export const LockTokens = ({ availableBalance, onLock }: LockTokensProps) => {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState<string>('');
  const [isLocking, setIsLocking] = useState(false);

  const durationOptions = [
    { label: '1 Hour', value: '3600' },
    { label: '1 Day', value: '86400' },
    { label: '1 Week', value: '604800' },
    { label: '1 Month', value: '2592000' },
    { label: '3 Months', value: '7776000' },
    { label: '6 Months', value: '15552000' },
    { label: '1 Year', value: '31536000' },
  ];

  const handleLock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !duration) {
      toast.error('Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount <= 0 || numAmount > availableBalance) {
      toast.error('Invalid amount');
      return;
    }

    setIsLocking(true);
    
    try {
      await onLock(numAmount, parseInt(duration));
      setAmount('');
      setDuration('');
      const durationLabel = durationOptions.find(d => d.value === duration)?.label;
      toast.success(`Successfully locked ${numAmount} VDT for ${durationLabel}!`);
    } catch (error) {
      toast.error('Transaction failed');
      console.error(error);
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border border-border">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">Lock Tokens</h3>
      </div>

      <form onSubmit={handleLock} className="space-y-4">
        <div>
          <Label htmlFor="lockAmount">Amount to Lock (VDT)</Label>
          <Input
            id="lockAmount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            max={availableBalance}
            step="0.01"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Available: {availableBalance.toLocaleString()} VDT
          </p>
        </div>

        <div>
          <Label htmlFor="lockDuration">Lock Duration</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          disabled={isLocking || !amount || !duration}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          {isLocking ? 'Locking...' : 'Lock Tokens'}
        </Button>
      </form>
    </Card>
  );
};