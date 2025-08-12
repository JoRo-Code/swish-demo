import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { currentBalance } from "@/lib/mockData";

export const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <Card className="bg-gradient-balance text-balance-text p-6 shadow-primary border-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1">Tillgängligt saldo</p>
          <p className="text-3xl font-bold">
            {showBalance ? `${currentBalance.toLocaleString('sv-SE')} kr` : '••••••'}
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
          <p className="text-sm font-semibold">+2 450 kr</p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-80">Utgifter</p>
          <p className="text-sm font-semibold">-1 825 kr</p>
        </div>
      </div>
    </Card>
  );
};