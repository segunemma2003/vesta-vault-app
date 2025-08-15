import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Unlock } from 'lucide-react';
import { toast } from 'sonner';

interface Lock {
  id: number;
  amount: number;
  unlockTime: Date;
  duration: string;
}

interface ActiveLocksProps {
  locks: Lock[];
  onUnlock: (lockId: number) => void;
}

export const ActiveLocks = ({ locks, onUnlock }: ActiveLocksProps) => {
  const handleUnlock = (lock: Lock) => {
    const now = new Date();
    if (now < lock.unlockTime) {
      toast.error('Tokens are still locked');
      return;
    }
    
    onUnlock(lock.id);
    toast.success(`Unlocked ${lock.amount} VDT!`);
  };

  const formatTimeRemaining = (unlockTime: Date) => {
    const now = new Date();
    const diff = unlockTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ready to unlock';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isUnlockable = (unlockTime: Date) => {
    return new Date() >= unlockTime;
  };

  if (locks.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card border border-border text-center">
        <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Active Locks</h3>
        <p className="text-muted-foreground">
          You don't have any locked tokens at the moment.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border border-border">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">Active Locks</h3>
      </div>

      <div className="space-y-4">
        {locks.map((lock) => (
          <div key={lock.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold">{lock.amount.toLocaleString()} VDT</span>
                <Badge variant="outline" className="text-xs">
                  {lock.duration}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {isUnlockable(lock.unlockTime) ? (
                  <span className="text-success">Ready to unlock</span>
                ) : (
                  `Unlocks in ${formatTimeRemaining(lock.unlockTime)}`
                )}
              </p>
            </div>
            
            <Button
              onClick={() => handleUnlock(lock)}
              disabled={!isUnlockable(lock.unlockTime)}
              variant={isUnlockable(lock.unlockTime) ? 'default' : 'secondary'}
              size="sm"
              className={isUnlockable(lock.unlockTime) ? 'bg-gradient-primary hover:shadow-glow' : ''}
            >
              <Unlock className="w-4 h-4 mr-2" />
              Unlock
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};