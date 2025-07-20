import { v4 as uuid } from 'uuid';
import { dayjs } from '@/lib/dayjs';
import type { Customer, CustomerMetrics, CustomersApiResponse } from '@/types';

export function normalizeCustomersData(
  apiResponse: CustomersApiResponse
): Customer[] {
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
  const totalSales = customer.vendas.reduce(
    (sum, venda) => sum + venda.valor,
    0
  );
  const averageSaleValue =
    customer.vendas.length > 0 ? totalSales / customer.vendas.length : 0;
  const buyingFrequency = customer.vendas.length;

  return {
    cliente: customer,
    totalVendas: totalSales,
    mediaValorVenda: averageSaleValue,
    frequenciaCompras: buyingFrequency,
    primeiraLetraFaltante: getFirstMissingLetter(customer.nomeCompleto),
  };
}

export function getFirstMissingLetter(nomeCompleto: string): string {
  const nomeUpper = nomeCompleto.toUpperCase();
  const letters = new Set(
    // biome-ignore lint/performance/useTopLevelRegex: just ignore it
    nomeUpper.split('').filter((char) => /[A-Z]/.test(char))
  );

  for (let i = 65; i <= 90; i++) {
    // A-Z em ASCII
    const letter = String.fromCharCode(i);
    if (!letters.has(letter)) {
      return letter;
    }
  }

  return '-'; // Todas as letras estão presentes
}

export function groupSalesByDate(customers: Customer[]) {
  const salesByDay = new Map<string, number>();

  for (const customer of customers) {
    for (const venda of customer.vendas) {
      const { data, valor } = venda;
      salesByDay.set(data, (salesByDay.get(data) || 0) + valor);
    }
  }

  const result: { data: string; valor: number }[] = [];

  for (const [data, valor] of salesByDay) {
    result.push({ data, valor });
  }

  result.sort((a, b) => dayjs(a.data).valueOf() - dayjs(b.data).valueOf());

  return result;
}
