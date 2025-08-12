export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  initials: string;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  recipient: string;
  recipientPhone?: string;
  timestamp: Date;
  message?: string;
  status: 'completed' | 'pending' | 'failed';
}

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Anna Svensson',
    phone: '+46 70 123 4567',
    avatar: '',
    initials: 'AS'
  },
  {
    id: '2', 
    name: 'Erik Johansson',
    phone: '+46 73 987 6543',
    avatar: '',
    initials: 'EJ'
  },
  {
    id: '3',
    name: 'Maria Andersson',
    phone: '+46 76 555 0123',
    avatar: '',
    initials: 'MA'
  },
  {
    id: '4',
    name: 'Johan Lindqvist',
    phone: '+46 72 444 9876',
    avatar: '',
    initials: 'JL'
  },
  {
    id: '5',
    name: 'Sara Nilsson',
    phone: '+46 74 333 5678',
    avatar: '',
    initials: 'SN'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'received',
    amount: 250,
    recipient: 'Anna Svensson',
    recipientPhone: '+46 70 123 4567',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    message: 'Tack för middagen! 🍕',
    status: 'completed'
  },
  {
    id: '2',
    type: 'sent',
    amount: 150,
    recipient: 'Erik Johansson',
    recipientPhone: '+46 73 987 6543',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    message: 'Kaffepengar',
    status: 'completed'
  },
  {
    id: '3',
    type: 'received',
    amount: 500,
    recipient: 'Maria Andersson', 
    recipientPhone: '+46 76 555 0123',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    message: 'Hyra för mars',
    status: 'completed'
  },
  {
    id: '4',
    type: 'sent',
    amount: 75,
    recipient: 'Johan Lindqvist',
    recipientPhone: '+46 72 444 9876',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    message: 'Lunch på fredag',
    status: 'completed'
  },
  {
    id: '5',
    type: 'sent',
    amount: 1200,
    recipient: 'Sara Nilsson',
    recipientPhone: '+46 74 333 5678',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    message: 'Dator reparation',
    status: 'completed'
  },
  {
    id: '6',
    type: 'received',
    amount: 300,
    recipient: 'Anna Svensson',
    recipientPhone: '+46 70 123 4567',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    message: 'Födelsedag present',
    status: 'completed'
  }
];

export const currentBalance = 2847.50;