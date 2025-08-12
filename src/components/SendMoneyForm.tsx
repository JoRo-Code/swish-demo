import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, X } from "lucide-react";
import { Contact, userService } from "@/services/userService";
import { transactionService } from "@/services/transactionService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SendMoneyFormProps {
  selectedContact?: Contact;
  onClose: () => void;
  onTransactionComplete?: () => void;
}

export const SendMoneyForm = ({ selectedContact, onClose, onTransactionComplete }: SendMoneyFormProps) => {
  const { user, refreshBalance } = useAuth();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(selectedContact?.phone || "");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  const loadContacts = async () => {
    if (!user) return;
    
    setIsLoadingContacts(true);
    try {
      const response = await userService.getUserContacts(user.id);
      if (response.data) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setRecipient(contact.phone);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !recipient || !user) {
      toast({
        title: "Fel",
        description: "Vänligen fyll i alla obligatoriska fält",
        variant: "destructive"
      });
      return;
    }

    // Validate and clean the amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Fel",
        description: "Vänligen ange ett giltigt belopp",
        variant: "destructive"
      });
      return;
    }

    // Round to 2 decimal places to prevent floating point precision issues
    const cleanAmount = Math.round(numericAmount * 100) / 100;

    setIsLoading(true);

    try {
      const response = await transactionService.createTransfer({
        sender_phone: user.phoneNumber,
        receiver_phone: recipient,
        amount: cleanAmount,
        description: message || undefined
      });

      if (response.data) {
        toast({
          title: "Betalning skickad!",
          description: `${amount} kr har skickats till ${selectedContact?.name || recipient}`,
        });
        
        // Reset form
        setAmount("");
        setRecipient("");
        setMessage("");
        
        // Refresh balance and notify parent component
        if (onTransactionComplete) {
          onTransactionComplete();
        }
        
        // Refresh user balance
        await refreshBalance();
        
        onClose();
      } else {
        toast({
          title: "Betalning misslyckades",
          description: response.error || "Ett fel inträffade vid betalningen",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Betalning misslyckades",
        description: "Ett oväntat fel inträffade",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Skicka pengar</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <Label htmlFor="recipient">Till</Label>
          <Input
            id="recipient"
            placeholder="+46 70 123 4567"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="mt-1"
          />
          {selectedContact && (
            <p className="text-sm text-muted-foreground mt-1">
              {selectedContact.name}
            </p>
          )}
        </div>

        {/* Contacts Section */}
        <div>
          <Label className="text-sm font-medium">Välj från kontakter</Label>
          {isLoadingContacts ? (
            <div className="mt-2 text-center text-muted-foreground text-sm">
              Laddar kontakter...
            </div>
          ) : contacts.length > 0 ? (
            <div className="mt-2 flex space-x-3 overflow-x-auto pb-2">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => handleContactSelect(contact)}
                  className={`flex flex-col items-center space-y-1 min-w-fit p-2 rounded-lg transition-colors ${
                    recipient === contact.phone 
                      ? 'bg-primary/10 border border-primary' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                      {contact.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center max-w-16 truncate">
                    {contact.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-2 text-center text-muted-foreground text-sm py-2">
              Inga kontakter än
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="amount">Belopp</Label>
          <div className="relative mt-1">
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
              kr
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="message">Meddelande (valfritt)</Label>
          <Textarea
            id="message"
            placeholder="Vad är betalningen för?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
          <Send className="h-4 w-4 mr-2" />
          Skicka {amount && `${amount} kr`}
        </Button>
      </form>
    </Card>
  );
};
