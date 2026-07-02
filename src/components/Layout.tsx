
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi deslogado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/80 backdrop-blur-md px-3 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-base sm:text-lg font-display font-semibold tracking-tight truncate">
              Sistema Imobiliário
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <NotificationCenter />
            <div className="flex items-center gap-2 pl-2 sm:pl-3 sm:border-l border-border/60">
              <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0 shadow-soft">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-muted-foreground hidden lg:block max-w-[200px] truncate">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sair">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto px-2 sm:px-2 md:px-3 py-3 sm:py-4 bg-gradient-to-b from-background to-muted/30">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
