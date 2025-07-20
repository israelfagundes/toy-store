import { AlertTriangle, Loader2 } from "lucide-react";
import { CustomersTable } from "@/components/customers-table";
import { Header } from "@/components/layout/header";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, useCustomers } from "@/hooks/use-customers";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export function Dashboard() {
  const { data: customers, isLoading, error } = useCustomers();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
              <h2 className="mb-2 font-bold text-2xl">Carregando dados...</h2>
              <p className="text-muted-foreground">
                Buscando informações dos clientes da loja
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-[100px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="mb-2 h-8 w-[120px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert className="mx-auto max-w-2xl" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar dados: {error.message}
              <br />
              <span className="text-sm">
                Certifique-se de que o JSON Server está rodando em{" "}
                {API_BASE_URL}
              </span>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="fade-in-up text-center">
            <h1 className="mb-4 font-bold text-4xl">
              Dashboard da Loja de Brinquedos
            </h1>
            <p className="text-muted-foreground text-xl">
              Gerencie clientes e visualize estatísticas de vendas
            </p>
          </div>

          {customers?.length ? (
            <CustomersTable customers={customers} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Nenhum cliente encontrado</CardTitle>
                <CardDescription>
                  Comece adicionando um novo cliente para ver as estatísticas
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
