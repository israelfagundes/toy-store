import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { ResponsiveContainer } from "recharts";
import { LineChart, type TooltipProps } from "@/components/line-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dayjs } from "@/lib/dayjs";
import type { Customer } from "@/types";
import { groupSalesByDate } from "@/utils/data-utils";
import { formatCurrency } from "@/utils/formatCurrency";

interface SalesChartProps {
  customers: Customer[];
}

const COLORS = [
  "",
  "hsl(var(--accent))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--primary-glow))",
];

export function SalesChart({ customers }: SalesChartProps) {
  const [datas, setDatas] = useState<TooltipProps | null>(null);

  const payload = datas?.payload?.[0];
  const value = payload?.value;

  const salesData = groupSalesByDate(customers).map((item) => ({
    ...item,
    Valor: item.valor,
    date: dayjs(item.data).format("DD/MM/YYYY"),
  }));

  const formattedValue = payload
    ? formatCurrency(value ?? 0)
    : formatCurrency(salesData.at(-1)?.Valor ?? 0);

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Vendas por Dia - {formattedValue}{" "}
              {payload ? `(${payload.index})` : `(${salesData.at(-1)?.date})`}
            </CardTitle>
            <CardDescription>Volume de vendas diário</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart
              categories={["Valor"]}
              className="-mb-2 mt-8 h-48"
              data={salesData}
              index="date"
              showLegend={false}
              showYAxis={false}
              startEndOnly={true}
              tooltipCallback={(props) => {
                if (props.active) {
                  setDatas((prev) => {
                    if (prev?.label === props.label) {
                      return prev;
                    }
                    return props;
                  });
                } else {
                  setDatas(null);
                }
                return null;
              }}
              valueFormatter={(revenue) => formatCurrency(revenue)}
            />
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
