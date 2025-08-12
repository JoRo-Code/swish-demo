import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Contact, userService } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

interface ContactListProps {
  onContactSelect: (contact: Contact) => void;
}

export const ContactList = ({ onContactSelect }: ContactListProps) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  const loadContacts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await userService.getUserContacts(user.id);
      if (response.data) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-sm mb-3">Senaste kontakter</h3>
        <div className="text-center text-muted-foreground">
          Laddar kontakter...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm mb-3">Senaste kontakter</h3>
      {contacts.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {contacts.slice(0, 5).map((contact) => (
            <button
              key={contact.id}
              onClick={() => onContactSelect(contact)}
              className="flex flex-col items-center space-y-2 min-w-fit hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {contact.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground max-w-16 truncate">
                {contact.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-4">
          <p className="text-sm">Inga kontakter än</p>
          <p className="text-xs">Lägg till kontakter genom att skicka pengar</p>
        </div>
      )}
    </div>
  );
};
