import { AlertCircle, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const success = await login(email, password);

    if (!success) {
      setError("Email ou senha incorretos");
    }

    setIsLoading(false);
  };

  return (
    <div className="gradient-primary flex min-h-screen items-center justify-center p-4">
      <Card className="fade-in-up w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="toy-bounce rounded-full bg-primary p-3">
              <Gamepad2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="font-bold text-2xl">ToyStore Manager</CardTitle>
          <CardDescription>
            Faça login para gerenciar sua loja de brinquedos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@toystore.com"
                required
                type="email"
                value={email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">password</Label>
              <Input
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full transition-opacity hover:opacity-90"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-muted-foreground text-sm">
              <p>Credenciais de teste:</p>
              <p>
                <strong>Email:</strong> admin@toystore.com
              </p>
              <p>
                <strong>password:</strong> admin123
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
