export interface User {
  id: string;
  email: string;
  nome: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

export interface Sell {
  data: string;
  valor: number;
}

export interface Customer {
  id: string;
  nomeCompleto: string;
  email: string;
  nascimento: string;
  vendas: Sell[];
}

export interface CustomersApiResponse {
  data: {
    clientes: Array<{
      info: {
        nomeCompleto: string;
        detalhes: {
          email: string;
          nascimento: string;
        };
      };
      duplicado?: {
        nomeCompleto: string;
      };
      estatisticas: {
        vendas: Sell[];
      };
    }>;
  };
  meta: {
    registroTotal: number;
    pagina: number;
  };
  redundante: {
    status: string;
  };
}

export interface CustomerMetrics {
  cliente: Customer;
  totalVendas: number;
  mediaValorVenda: number;
  frequenciaCompras: number;
  primeiraLetraFaltante: string;
}
