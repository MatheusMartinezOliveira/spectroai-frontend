import axios, { AxiosInstance } from 'axios';

// Tipos de resposta da API
export interface AIResponse {
  text: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    action?: string;
  };
}

export interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  participants: string[];
  confirmed: number;
  unconfirmed: number;
  link?: string;
}

export interface IntegrationStatus {
  name: string;
  connected: boolean;
  lastSync?: Date;
}

export interface WorkspaceApp {
  name: string;
  path: string;
  arguments?: string[];
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

class SpectroAPIService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // TODO: Configurar URL do backend
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('spectro_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ==================== CHAT ====================

  /**
   * Envia mensagem de texto para a IA
   */
  async sendMessage(text: string): Promise<AIResponse> {
    try {
      const response = await this.api.post<AIResponse>('/chat/message', { text });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  /**
   * Envia áudio para transcrição e processamento
   */
  async sendAudio(audioBlob: Blob): Promise<AIResponse> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await this.api.post<AIResponse>('/chat/audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar áudio:', error);
      throw error;
    }
  }

  /**
   * Envia arquivo para processamento
   */
  async sendFile(file: File): Promise<AIResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.api.post<AIResponse>('/chat/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      throw error;
    }
  }

  // ==================== GOOGLE AGENDA ====================

  /**
   * Conecta com Google Calendar
   */
  async connectGoogleCalendar(authCode: string): Promise<void> {
    try {
      await this.api.post('/integrations/google-calendar/connect', { authCode });
    } catch (error) {
      console.error('Erro ao conectar Google Calendar:', error);
      throw error;
    }
  }

  /**
   * Busca reuniões próximas
   */
  async getUpcomingMeetings(): Promise<Meeting[]> {
    try {
      const response = await this.api.get<Meeting[]>('/calendar/upcoming');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar reuniões:', error);
      throw error;
    }
  }

  /**
   * Cria novo evento no calendário
   */
  async createEvent(event: Partial<Meeting>): Promise<Meeting> {
    try {
      const response = await this.api.post<Meeting>('/calendar/events', event);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  }

  // ==================== EMAIL ====================

  /**
   * Envia e-mail
   */
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.api.post('/email/send', { to, subject, body });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }

  /**
   * Lista e-mails recentes
   */
  async getRecentEmails(limit: number = 10): Promise<any[]> {
    try {
      const response = await this.api.get(`/email/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar e-mails:', error);
      throw error;
    }
  }

  // ==================== WHATSAPP ====================

  /**
   * Conecta com WhatsApp via Baileys
   */
  async connectWhatsApp(): Promise<{ qrCode?: string }> {
    try {
      const response = await this.api.post('/integrations/whatsapp/connect');
      return response.data;
    } catch (error) {
      console.error('Erro ao conectar WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Envia mensagem no WhatsApp
   */
  async sendWhatsAppMessage(to: string, message: string): Promise<void> {
    try {
      await this.api.post('/whatsapp/send', { to, message });
    } catch (error) {
      console.error('Erro ao enviar mensagem no WhatsApp:', error);
      throw error;
    }
  }

  // ==================== SLACK ====================

  /**
   * Conecta com Slack
   */
  async connectSlack(authCode: string): Promise<void> {
    try {
      await this.api.post('/integrations/slack/connect', { authCode });
    } catch (error) {
      console.error('Erro ao conectar Slack:', error);
      throw error;
    }
  }

  /**
   * Envia mensagem no Slack
   */
  async sendSlackMessage(channel: string, message: string): Promise<void> {
    try {
      await this.api.post('/slack/send', { channel, message });
    } catch (error) {
      console.error('Erro ao enviar mensagem no Slack:', error);
      throw error;
    }
  }

  // ==================== INTEGRAÇÕES ====================

  /**
   * Busca status de todas as integrações
   */
  async getIntegrationsStatus(): Promise<IntegrationStatus[]> {
    try {
      const response = await this.api.get<IntegrationStatus[]>('/integrations/status');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar status das integrações:', error);
      throw error;
    }
  }

  /**
   * Desconecta uma integração
   */
  async disconnectIntegration(integrationName: string): Promise<void> {
    try {
      await this.api.post(`/integrations/${integrationName}/disconnect`);
    } catch (error) {
      console.error('Erro ao desconectar integração:', error);
      throw error;
    }
  }

  // ==================== WORKSPACE ====================

  /**
   * Salva configuração do workspace
   */
  async saveWorkspaceConfig(apps: WorkspaceApp[]): Promise<void> {
    try {
      await this.api.post('/workspace/save', { apps });
    } catch (error) {
      console.error('Erro ao salvar workspace:', error);
      throw error;
    }
  }

  /**
   * Carrega configuração do workspace
   */
  async loadWorkspaceConfig(): Promise<WorkspaceApp[]> {
    try {
      const response = await this.api.get<WorkspaceApp[]>('/workspace/load');
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar workspace:', error);
      throw error;
    }
  }

  /**
   * Abre workspace (backend executa os apps)
   */
  async openWorkspace(): Promise<void> {
    try {
      await this.api.post('/workspace/open');
    } catch (error) {
      console.error('Erro ao abrir workspace:', error);
      throw error;
    }
  }

  // ==================== NOTIFICAÇÕES ====================

  /**
   * Busca notificações pendentes
   */
  async getNotifications(): Promise<any[]> {
    try {
      const response = await this.api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  /**
   * Marca notificação como lida
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await this.api.post(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Erro ao marcar notificação:', error);
      throw error;
    }
  }
}

// Exporta instância singleton
export const spectroAPI = new SpectroAPIService();
export default spectroAPI;

