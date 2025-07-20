import { Gamepad2, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-primary p-2">
            <Gamepad2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-xl">ToyStore Manager</h1>
            <p className="text-muted-foreground text-sm">
              Sistema de Gerenciamento
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.nome.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{user?.nome}</span>
          </div>

          <Button
            className="hover:bg-destructive hover:text-destructive-foreground"
            onClick={logout}
            size="sm"
            variant="outline"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
