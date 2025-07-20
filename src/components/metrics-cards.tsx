import { Crown, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Customer } from "@/types";
import { calculateCustomerMetrics } from "@/utils/data-utils";
import { formatCurrency } from "@/utils/formatCurrency";

interface MetricsCardsProps {
  customers: Customer[];
}

export function MetricsCards({ customers }: MetricsCardsProps) {
  const metrics = customers.map(calculateCustomerMetrics);

  const highestVolumeCustomer = metrics.reduce((prev, current) =>
    prev.totalVendas > current.totalVendas ? prev : current
  );

  const highestAverageCustomer = metrics.reduce((prev, current) =>
    prev.mediaValorVenda > current.mediaValorVenda ? prev : current
  );

  const highestFrequencyCustomer = metrics.reduce((prev, current) =>
    prev.frequenciaCompras > current.frequenciaCompras ? prev : current
  );

  const totalVendasGeral = metrics.reduce((sum, m) => sum + m.totalVendas, 0);

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="gradient-card border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total de Vendas</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            {formatCurrency(totalVendasGeral)}
          </div>
          <p className="text-muted-foreground text-xs">
            Todas as vendas registradas
          </p>
        </CardContent>
      </Card>

      <Card className="gradient-card border-l-4 border-l-success">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Maior Volume</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-lg">
            {highestVolumeCustomer.cliente.nomeCompleto}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {formatCurrency(highestVolumeCustomer.totalVendas)}
            </p>
            <Badge variant="secondary">
              <Crown className="mr-1 h-3 w-3" />
              Top
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-l-4 border-l-warning">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Maior Média</CardTitle>
          <DollarSign className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-lg">
            {highestAverageCustomer.cliente.nomeCompleto}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {formatCurrency(highestAverageCustomer.mediaValorVenda)}
            </p>
            <Badge variant="secondary">
              <Crown className="mr-1 h-3 w-3" />
              VIP
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card border-l-4 border-l-accent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Mais Frequente</CardTitle>
          <ShoppingCart className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-lg">
            {highestFrequencyCustomer.cliente.nomeCompleto}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {highestFrequencyCustomer.frequenciaCompras} compras
            </p>
            <Badge variant="secondary">
              <Crown className="mr-1 h-3 w-3" />
              Fiel
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
