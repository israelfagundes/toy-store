import {
  type ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Mail,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dayjs } from "@/lib/dayjs";
import type { Customer, CustomerMetrics } from "@/types";
import { calculateCustomerMetrics } from "@/utils/data-utils";

interface CustomerWithMetrics extends Customer {
  metricas: CustomerMetrics;
}

interface ClientesTableProps {
  customers: Customer[];
}

const columnHelper = createColumnHelper<CustomerWithMetrics>();

export function CustomersTable({ customers }: ClientesTableProps) {
  const dataWithMetrics = useMemo(
    () =>
      customers.map((cliente) => ({
        ...cliente,
        metricas: calculateCustomerMetrics(cliente),
      })),
    [customers]
  );

  // biome-ignore lint/suspicious/noExplicitAny: needed
  const columns: ColumnDef<CustomerWithMetrics, any>[] = useMemo(
    () => [
      columnHelper.accessor("nomeCompleto", {
        header: "Nome Completo",
        cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("nascimento", {
        header: "Data de Nascimento",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {dayjs(new Date(getValue())).format("dd/MM/yyyy")}
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.metricas.totalVendas, {
        id: "totalVendas",
        header: "Total Vendas",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-success" />
            <span className="font-medium">R$ {getValue().toFixed(2)}</span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.metricas.mediaValorVenda, {
        id: "mediaValorVenda",
        header: "Média por Venda",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-warning" />
            <span>R$ {getValue().toFixed(2)}</span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.metricas.frequenciaCompras, {
        id: "frequenciaCompras",
        header: "Frequência",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-accent" />
            <span>{getValue()} compras</span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.metricas.primeiraLetraFaltante, {
        id: "primeiraLetraFaltante",
        header: "Letra Faltante",
        cell: ({ getValue }) => (
          <Badge
            className="font-mono"
            variant={getValue() === "-" ? "default" : "secondary"}
          >
            <Award className="mr-1 h-3 w-3" />
            {getValue()}
          </Badge>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: dataWithMetrics,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Lista de Clientes
            </CardTitle>
            <CardDescription>
              Gerencie todos os clientes da loja com métricas detalhadas
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            className="max-w-sm"
            onChange={(event) =>
              table
                .getColumn("nomeCompleto")
                ?.setFilterValue(event.target.value)
            }
            placeholder="Buscar clientes..."
            value={
              (table.getColumn("nomeCompleto")?.getFilterValue() as string) ??
              ""
            }
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort();
                    const headerContent =
                      typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header;

                    const renderContent = () => {
                      if (header.isPlaceholder) {
                        return null;
                      }

                      if (isSortable) {
                        return (
                          <Button
                            className="h-auto p-0 hover:bg-transparent"
                            onClick={header.column.getToggleSortingHandler()}
                            variant="ghost"
                          >
                            {headerContent}
                          </Button>
                        );
                      }

                      return headerContent;
                    };

                    return (
                      <TableHead className="font-semibold" key={header.id}>
                        {renderContent()}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="transition-colors hover:bg-muted/50"
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {typeof cell.column.columnDef.cell === "function"
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.getValue()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="h-24 text-center"
                    colSpan={columns.length}
                  >
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-muted-foreground text-sm">
            Mostrando {table.getPaginationRowModel().rows.length} de{" "}
            {table.getCoreRowModel().rows.length} cliente(s)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              size="sm"
              variant="outline"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>
            <Button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              size="sm"
              variant="outline"
            >
              Próximo
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
