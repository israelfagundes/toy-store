import { useQuery } from "@tanstack/react-query";
import type { Customer, CustomersApiResponse } from "@/types";
import { normalizeCustomersData } from "@/utils/data-utils";

export const API_BASE_URL = "http://localhost:3000";

type UseCustomers = {
  setCustomers: (clientes: Customer[]) => void;
  customers: Customer[];
};

export function useCustomers({ setCustomers, customers }: UseCustomers) {
  return useQuery<Customer[]>({
    queryKey: ["clientes"],
    queryFn: async () => {
      if (customers.length) {
        return customers;
      }

      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) {
        throw new Error("Erro ao buscar clientes");
      }
      const data: CustomersApiResponse = await response.json();
      const normalizedCustomersData = normalizeCustomersData(data);

      setCustomers(normalizedCustomersData);
      return normalizedCustomersData;
    },
  });
}
