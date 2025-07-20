import { v4 as uuid } from 'uuid';
import type { Customer, CustomerMetrics, CustomersApiResponse } from '@/types';

export function normalizeCustomersData(apiResponse: CustomersApiResponse): Customer[] {
  return apiResponse.data.clientes.map((clienteRaw) => {

    const nomeCompleto = clienteRaw.info.nomeCompleto;
    const email = clienteRaw.info.detalhes.email;
    const nascimento = clienteRaw.info.detalhes.nascimento;
    const vendas = clienteRaw.estatisticas.vendas || [];

    return {
      id: uuid(),
      nomeCompleto,
      email,
      nascimento,
      vendas,
    };
  });
}

export function calculateCustomerMetrics(customer: Customer): CustomerMetrics {
  const totalVendas = customer.vendas.reduce((sum, venda) => sum + venda.valor, 0);
  const mediaValorVenda = customer.vendas.length > 0 ? totalVendas / customer.vendas.length : 0;
  const frequenciaCompras = customer.vendas.length;

  return {
    cliente: customer,
    totalVendas,
    mediaValorVenda,
    frequenciaCompras,
    primeiraLetraFaltante: getFirstMissingLetter(customer.nomeCompleto)
  };
}

export function getFirstMissingLetter(nomeCompleto: string): string {
  const nomeUpper = nomeCompleto.toUpperCase();
  // biome-ignore lint/performance/useTopLevelRegex: just ignore it
  const letrasPresentes = new Set(nomeUpper.split('').filter(char => /[A-Z]/.test(char)));

  for (let i = 65; i <= 90; i++) { // A-Z em ASCII
    const letra = String.fromCharCode(i);
    if (!letrasPresentes.has(letra)) {
      return letra;
    }
  }

  return '-'; // Todas as letras estão presentes
}