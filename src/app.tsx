import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { Dashboard } from "@/pages/dashboard";
import { Login } from "@/pages/login";
import { NotFound } from "@/pages/not-found";
import { PrivateRoute } from "./components/private-route";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/" />
          <Route
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
            path="/home"
          />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
