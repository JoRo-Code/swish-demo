import { apiClient, ApiResponse } from './api';
import { Transaction, TransferRequest, TransferResponse } from './userService';

export interface TransactionStats {
  user_id: string;
  period_days: number;
  total_transactions: number;
  sent: {
    count: number;
    total_amount: number;
    currency: string;
  };
  received: {
    count: number;
    total_amount: number;
    currency: string;
  };
  net_amount: number;
}

class TransactionService {
  private baseUrl = 'http://localhost:3003'; // Transaction service URL

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const token = localStorage.getItem('auth_token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || `HTTP ${response.status}`,
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  async createTransfer(transferData: TransferRequest): Promise<ApiResponse<TransferResponse>> {
    return this.request<TransferResponse>('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
  }

  async getUserTransactions(userId: string, limit: number = 10): Promise<ApiResponse<{
    transactions: Transaction[];
    count: number;
    user_id: string;
  }>> {
    const response = await this.request<{
      transactions: any[];
      count: number;
      user_id: string;
    }>(`/transactions/user/${userId}/recent?limit=${limit}`, { method: 'GET' });

    if (response.data) {
      // Transform backend transactions to frontend format
      const transformedTransactions = response.data.transactions.map(tx => this.transformTransaction(tx, userId));
      
      return {
        ...response,
        data: {
          ...response.data,
          transactions: transformedTransactions
        }
      };
    }

    return response as ApiResponse<{
      transactions: Transaction[];
      count: number;
      user_id: string;
    }>;
  }

  async getTransaction(transactionId: string): Promise<ApiResponse<Transaction>> {
    const response = await this.request<any>(`/transactions/${transactionId}`, { method: 'GET' });
    
    if (response.data) {
      const transformedTransaction = this.transformTransaction(response.data);
      return {
        ...response,
        data: transformedTransaction
      };
    }

    return response as ApiResponse<Transaction>;
  }

  async getTransactionsBetweenUsers(user1Id: string, user2Id: string, limit: number = 20): Promise<ApiResponse<{
    transactions: Transaction[];
    count: number;
    user1_id: string;
    user2_id: string;
  }>> {
    const response = await this.request<{
      transactions: any[];
      count: number;
      user1_id: string;
      user2_id: string;
    }>(`/transactions/between/${user1Id}/${user2Id}?limit=${limit}`, { method: 'GET' });

    if (response.data) {
      const transformedTransactions = response.data.transactions.map(tx => this.transformTransaction(tx, user1Id));
      
      return {
        ...response,
        data: {
          ...response.data,
          transactions: transformedTransactions
        }
      };
    }

    return response as ApiResponse<{
      transactions: Transaction[];
      count: number;
      user1_id: string;
      user2_id: string;
    }>;
  }

  async cancelTransaction(transactionId: string): Promise<ApiResponse<{
    transaction_id: string;
    status: string;
    cancelled_at: string;
  }>> {
    return this.request<{
      transaction_id: string;
      status: string;
      cancelled_at: string;
    }>(`/transactions/${transactionId}/cancel`, { method: 'PUT' });
  }

  async getUserTransactionStats(userId: string, days: number = 30): Promise<ApiResponse<TransactionStats>> {
    return this.request<TransactionStats>(`/transactions/stats/${userId}?days=${days}`, { method: 'GET' });
  }

  private transformTransaction(backendTx: any, currentUserId?: string): Transaction {
    // Determine if this is a sent or received transaction for the current user
    let type: 'sent' | 'received' = 'sent';
    let recipient = '';
    let recipientPhone = '';

    if (currentUserId) {
      if (backendTx.sender_id === currentUserId || backendTx.sender?.id === currentUserId) {
        type = 'sent';
        recipient = backendTx.receiver?.name || `${backendTx.receiver?.firstName || ''} ${backendTx.receiver?.lastName || ''}`.trim();
        recipientPhone = backendTx.receiver?.phoneNumber || backendTx.receiver?.phone;
      } else {
        type = 'received';
        recipient = backendTx.sender?.name || `${backendTx.sender?.firstName || ''} ${backendTx.sender?.lastName || ''}`.trim();
        recipientPhone = backendTx.sender?.phoneNumber || backendTx.sender?.phone;
      }
    } else {
      // Default to sender info if no current user context
      recipient = backendTx.receiver?.name || `${backendTx.receiver?.firstName || ''} ${backendTx.receiver?.lastName || ''}`.trim();
      recipientPhone = backendTx.receiver?.phoneNumber || backendTx.receiver?.phone;
    }

    return {
      id: backendTx.id,
      type,
      amount: parseFloat(backendTx.amount),
      recipient,
      recipientPhone,
      timestamp: new Date(backendTx.created_at),
      message: backendTx.description,
      status: this.mapStatus(backendTx.status),
      sender: backendTx.sender ? {
        id: backendTx.sender.id,
        name: backendTx.sender.name || `${backendTx.sender.firstName || ''} ${backendTx.sender.lastName || ''}`.trim(),
        phoneNumber: backendTx.sender.phoneNumber || backendTx.sender.phone
      } : undefined,
      receiver: backendTx.receiver ? {
        id: backendTx.receiver.id,
        name: backendTx.receiver.name || `${backendTx.receiver.firstName || ''} ${backendTx.receiver.lastName || ''}`.trim(),
        phoneNumber: backendTx.receiver.phoneNumber || backendTx.receiver.phone
      } : undefined
    };
  }

  private mapStatus(backendStatus: string): 'completed' | 'pending' | 'failed' {
    switch (backendStatus.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'pending':
      case 'authorized':
        return 'pending';
      case 'failed':
      case 'cancelled':
        return 'failed';
      default:
        return 'pending';
    }
  }
}

export const transactionService = new TransactionService();
