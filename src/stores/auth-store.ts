import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '@/types';
import { sleep } from '@/utils/sleep';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, senha: string) => {
        // Simulação de autenticação simples
        if (email === 'admin@toystore.com' && senha === 'admin123') {
          const user = {
            id: '1',
            email: 'admin@toystore.com',
            nome: 'Administrador'
          };

          await sleep(1000)

          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'toy-store-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);