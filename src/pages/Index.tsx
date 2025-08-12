import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, History, QrCode } from "lucide-react";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem } from "@/components/TransactionItem";
import { ContactList } from "@/components/ContactList";
import { SendMoneyForm } from "@/components/SendMoneyForm";
import { mockTransactions, Contact } from "@/lib/mockData";
import financialBg from "@/assets/financial-bg.jpg";

const Index = () => {
  const [showSendForm, setShowSendForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setShowSendForm(true);
  };

  const handleSendMoney = () => {
    setSelectedContact(undefined);
    setShowSendForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background */}
      <div 
        className="relative h-80 bg-cover bg-center flex items-end"
        style={{ backgroundImage: `url(${financialBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
        <div className="relative w-full max-w-md mx-auto p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary mb-2">Swish</h1>
            <p className="text-muted-foreground">Enkel och säker betalning</p>
          </div>
          <BalanceCard />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 bg-gradient-card shadow-card border-0"
            onClick={handleSendMoney}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Skicka</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 bg-gradient-card shadow-card border-0"
          >
            <QrCode className="h-5 w-5" />
            <span className="text-xs">Begär</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 bg-gradient-card shadow-card border-0"
          >
            <History className="h-5 w-5" />
            <span className="text-xs">Historik</span>
          </Button>
        </div>

        {/* Send Money Form */}
        {showSendForm && (
          <SendMoneyForm 
            selectedContact={selectedContact}
            onClose={() => {
              setShowSendForm(false);
              setSelectedContact(undefined);
            }}
          />
        )}

        {/* Recent Contacts */}
        {!showSendForm && (
          <Card className="p-4 bg-gradient-card shadow-card border-0">
            <ContactList onContactSelect={handleContactSelect} />
          </Card>
        )}

        {/* Recent Transactions */}
        {!showSendForm && (
          <Card className="bg-gradient-card shadow-card border-0">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Senaste transaktioner</h3>
            </div>
            <div className="divide-y">
              {mockTransactions.slice(0, 5).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
