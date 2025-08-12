import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, X } from "lucide-react";
import { Contact } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

interface SendMoneyFormProps {
  selectedContact?: Contact;
  onClose: () => void;
}

export const SendMoneyForm = ({ selectedContact, onClose }: SendMoneyFormProps) => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(selectedContact?.phone || "");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !recipient) {
      toast({
        title: "Fel",
        description: "Vänligen fyll i alla obligatoriska fält",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending money
    toast({
      title: "Betalning skickad!",
      description: `${amount} kr har skickats till ${selectedContact?.name || recipient}`,
    });
    
    // Reset form
    setAmount("");
    setRecipient("");
    setMessage("");
    onClose();
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