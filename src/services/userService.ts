import { apiClient, ApiResponse } from './api';

export interface User {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  balance?: number;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  initials: string;
  recentTransactions?: Transaction[];
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
  sender?: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  receiver?: {
    id: string;
    name: string;
    phoneNumber: string;
  };
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface TransferRequest {
  sender_phone: string;
  receiver_phone: string;
  amount: number;
  description?: string;
}

export interface TransferResponse {
  transaction_id: string;
  status: string;
  sender: {
    id: string;
    phone: string;
    name: string;
  };
  receiver: {
    id: string;
    phone: string;
    name: string;
  };
  amount: number;
  currency: string;
  created_at: string;
}

class UserService {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/users/login', credentials);
    
    if (response.data?.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<{ message: string; userId: string; phoneNumber: string }>> {
    return apiClient.post('/users/register', userData);
  }

  async getUserByPhone(phoneNumber: string): Promise<ApiResponse<{
    user: User;
    paymentMethods: any[];
    recentTransactions: Transaction[];
  }>> {
    return apiClient.get(`/users/${phoneNumber}`);
  }

  async getUserContacts(userId: string): Promise<ApiResponse<{ contacts: Contact[] }>> {
    const response = await apiClient.get<{ contacts: any[] }>(`/users/${userId}/contacts`);
    
    if (response.data) {
      // Transform backend contacts to frontend format
      const transformedContacts = response.data.contacts.map(contact => ({
        id: contact.id,
        name: contact.nickname,
        phone: contact.phoneNumber,
        avatar: '',
        initials: this.getInitials(contact.nickname),
        recentTransactions: contact.recentTransactions || []
      }));
      
      return {
        ...response,
        data: { contacts: transformedContacts }
      };
    }
    
    return response as ApiResponse<{ contacts: Contact[] }>;
  }

  async addContact(userId: string, phoneNumber: string, nickname?: string): Promise<ApiResponse<{ message: string; contact: any }>> {
    return apiClient.post(`/users/${userId}/contacts`, {
      phoneNumber,
      nickname
    });
  }

  async validateUser(phoneNumber?: string, userId?: string): Promise<ApiResponse<{
    valid: boolean;
    user?: User;
    error?: string;
  }>> {
    return apiClient.post('/users/validate', {
      phoneNumber,
      userId
    });
  }

  async verifyUser(userId: string, verificationCode: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`/users/${userId}/verify`, {
      verificationCode
    });
  }

  async getUserBalance(userId: string): Promise<ApiResponse<{ userId: string; balance: number; currency: string }>> {
    return apiClient.get(`/users/${userId}/balance`);
  }

  logout() {
    apiClient.clearToken();
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

export const userService = new UserService();
