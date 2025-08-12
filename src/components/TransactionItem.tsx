import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Transaction } from "@/lib/mockData";

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just nu';
    } else if (diffInHours < 24) {
      return `${diffInHours}h sedan`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d sedan`;
    }
  };

  const isPositive = transaction.type === 'received';
  
  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${
          isPositive 
            ? 'bg-success/10 text-success' 
            : 'bg-destructive/10 text-destructive'
        }`}>
          {isPositive ? (
            <ArrowDownLeft className="h-4 w-4" />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          )}
        </div>
        
        <div>
          <p className="font-medium text-sm">{transaction.recipient}</p>
          <p className="text-xs text-muted-foreground">
            {transaction.message || (isPositive ? 'Mottagen betalning' : 'Skickad betalning')}
          </p>
          <p className="text-xs text-muted-foreground">{formatTime(transaction.timestamp)}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`font-semibold ${
          isPositive ? 'text-success' : 'text-destructive'
        }`}>
          {isPositive ? '+' : '-'}{transaction.amount.toLocaleString('sv-SE')} kr
        </p>
      </div>
    </div>
  );
};