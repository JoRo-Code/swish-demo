import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { transactionService, TransactionStats } from "@/services/transactionService";

export const BalanceCard = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [stats, setStats] = useState<TransactionStats | null>(null);

  useEffect(() => {
    if (user) {
      loadTransactionStats();
    }
  }, [user]);

  // Re-load stats when user balance changes
  useEffect(() => {
    if (user?.balance !== undefined) {
      loadTransactionStats();
    }
  }, [user?.balance]);

  const loadTransactionStats = async () => {
    if (!user) return;
    
    try {
      const response = await transactionService.getUserTransactionStats(user.id, 30);
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading transaction stats:', error);
    }
  };

  const balance = user?.balance || 0;
  const monthlyReceived = stats?.received.total_amount || 0;
  const monthlySent = stats?.sent.total_amount || 0;

  return (
    <Card className="bg-gradient-balance text-balance-text p-6 shadow-primary border-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1">Tillgängligt saldo</p>
          <p className="text-3xl font-bold">
            {showBalance ? `${balance.toLocaleString('sv-SE')} kr` : '••••••'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowBalance(!showBalance)}
          className="text-balance-text hover:bg-white/20"
        >
          {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="mt-4 flex space-x-4">
        <div className="text-center">
          <p className="text-xs opacity-80">Denna månad</p>
          <p className="text-sm font-semibold">+{monthlyReceived.toLocaleString('sv-SE')} kr</p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-80">Utgifter</p>
          <p className="text-sm font-semibold">-{monthlySent.toLocaleString('sv-SE')} kr</p>
        </div>
      </div>
    </Card>
  );
};
