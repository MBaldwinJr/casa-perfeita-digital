import {
  Building2,
  Users,
  FileText,
  CreditCard,
  Scale,
  Hammer,
  MessageSquare,
  BarChart3,
  Settings,
  Home,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home, color: "hsl(217 91% 60%)" },
  { title: "Imóveis", url: "/imoveis", icon: Building2, color: "hsl(160 84% 39%)" },
  { title: "Clientes", url: "/clientes", icon: Users, color: "hsl(38 92% 50%)" },
  { title: "Propostas", url: "/propostas", icon: FileText, color: "hsl(280 65% 60%)" },
  { title: "Financiamento", url: "/financiamento", icon: CreditCard, color: "hsl(142 71% 45%)" },
  { title: "Jurídico", url: "/juridico", icon: Scale, color: "hsl(0 72% 55%)" },
  { title: "Obras", url: "/obras", icon: Hammer, color: "hsl(25 95% 53%)" },
  { title: "Pós-venda", url: "/pos-venda", icon: MessageSquare, color: "hsl(190 90% 50%)" },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3, color: "hsl(260 70% 60%)" },
  { title: "Configurações", url: "/configuracoes", icon: Settings, color: "hsl(215 16% 60%)" },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg gradient-accent flex items-center justify-center shadow-soft">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-display font-bold tracking-tight text-sidebar-foreground">
              ImobiGest
            </span>
            <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
              Premium
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-0 py-4">
        <div className="px-4 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
            Fichário
          </span>
        </div>

        {/* Filing-cabinet tabs */}
        <nav className="relative flex flex-col">
          {menuItems.map((item) => {
            const active = pathname === item.url;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={cn(
                  "group relative flex items-center gap-3 pl-5 pr-3 py-2.5 ml-3 mr-0",
                  "rounded-l-lg border-y border-l transition-all duration-200",
                  "text-sm font-medium",
                  active
                    ? "bg-background text-foreground border-sidebar-border shadow-[inset_0_1px_0_hsl(var(--border)),-4px_0_12px_-6px_rgba(0,0,0,0.25)] z-10 -mr-px translate-x-0"
                    : "bg-sidebar-accent/40 text-sidebar-foreground/80 border-transparent hover:bg-sidebar-accent/70 hover:text-sidebar-foreground hover:translate-x-0.5"
                )}
                style={{ marginTop: "-1px" }}
              >
                {/* Colored tab indicator */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all",
                    active ? "opacity-100" : "opacity-40 group-hover:opacity-70"
                  )}
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />

                <Icon
                  className="h-4 w-4 shrink-0 transition-colors"
                  style={{ color: active ? item.color : undefined }}
                />
                <span className="truncate">{item.title}</span>

                {/* Notch that visually merges the tab with the content */}
                {active && (
                  <>
                    <span
                      className="absolute -top-2 right-0 h-2 w-2 bg-background"
                      aria-hidden
                    />
                    <span
                      className="absolute -bottom-2 right-0 h-2 w-2 bg-background"
                      aria-hidden
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
}
