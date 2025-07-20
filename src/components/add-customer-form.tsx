import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { dayjs } from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import { useCustomerStore } from "@/stores/customer-store";

const customerSchema = z.object({
  nomeCompleto: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("Email inválido"),
  nascimento: z.date({
    error: "Data de nascimento é obrigatória",
  }),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export function AddCustomerForm() {
  const queryClient = useQueryClient();

  const { addCustomer, customers } = useCustomerStore();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
    },
  });

  const onSubmit = (data: CustomerFormData) => {
    const newCustomer = {
      nomeCompleto: data.nomeCompleto,
      email: data.email,
      nascimento: dayjs(data.nascimento).toISOString().split("T")?.[0],
      vendas: [],
    };

    queryClient.setQueryData(["clientes"], [...customers, newCustomer]);

    addCustomer(newCustomer);

    toast({
      title: "Cliente adicionado!",
      description: `${data.nomeCompleto} foi adicionado com sucesso.`,
    });

    form.reset();
    setIsOpen(false);
  };

  return (
    <div className="mb-6 flex flex-1 justify-end">
      {isOpen ? (
        <Card className="fade-in-up flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Novo Cliente
            </CardTitle>
            <CardDescription>
              Adicione um novo cliente à loja de brinquedos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="nomeCompleto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Maria Silva Santos"
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="maria@email.com"
                          type="email"
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nascimento"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Nascimento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              variant="outline"
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", {
                                  locale: ptBR,
                                })
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            autoFocus
                            captionLayout="dropdown"
                            className={cn("pointer-events-auto p-3")}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            mode="single"
                            onSelect={field.onChange}
                            selected={field.value}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button className="hover:opacity-90" type="submit">
                    Adicionar Cliente
                  </Button>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      form.reset();
                    }}
                    type="button"
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Button
          className="hover:opacity-90"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
      )}
    </div>
  );
}
