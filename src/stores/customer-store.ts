import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomerStore } from '../types';

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set) => ({
      customers: [],
      isLoading: false,
      error: null,
      setCustomers: (customers) => set({ customers }),
      addCustomer: (customerData) => {
        const newCustomer = {
          ...customerData,
          id: uuid(),
        };

        set((state) => ({
          customers: [...state.customers, newCustomer],
        }));
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),
    }),
    {
      name: 'toy-store-clientes',
      partialize: (state) => ({ clientes: state.customers }),
    }
  )
);
