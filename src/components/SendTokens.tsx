import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface SendTokensProps {
  availableBalance: number;
  onSend: (to: string, amount: number) => Promise<void>;
}

export const SendTokens = ({ availableBalance, onSend }: SendTokensProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount <= 0 || numAmount > availableBalance) {
      toast.error('Invalid amount');
      return;
    }

    if (!recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Invalid recipient address');
      return;
    }

    setIsSending(true);
    
    try {
      await onSend(recipient, numAmount);
      setRecipient('');
      setAmount('');
      toast.success(`Successfully sent ${numAmount} VDT!`);
    } catch (error) {
      toast.error('Transaction failed');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border border-border">
      <div className="flex items-center gap-3 mb-6">
        <Send className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">Send Tokens</h3>
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="font-mono"
          />
        </div>

        <div>
          <Label htmlFor="amount">Amount (VDT)</Label>
          <Input
            id="amount"
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

        <Button 
          type="submit" 
          disabled={isSending || !recipient || !amount}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          {isSending ? 'Sending...' : 'Send Tokens'}
        </Button>
      </form>
    </Card>
  );
};