import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockContacts, Contact } from "@/lib/mockData";

interface ContactListProps {
  onContactSelect: (contact: Contact) => void;
}

export const ContactList = ({ onContactSelect }: ContactListProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm mb-3">Senaste kontakter</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {mockContacts.slice(0, 5).map((contact) => (
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
    </div>
  );
};