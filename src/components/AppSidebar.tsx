
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Imóveis",
    url: "/imoveis",
    icon: Building2,
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
  },
  {
    title: "Propostas & Contratos",
    url: "/propostas",
    icon: FileText,
  },
  {
    title: "Financiamento",
    url: "/financiamento",
    icon: CreditCard,
  },
  {
    title: "Jurídico",
    url: "/juridico",
    icon: Scale,
  },
  {
    title: "Obras",
    url: "/obras",
    icon: Hammer,
  },
  {
    title: "Pós-venda",
    url: "/pos-venda",
    icon: MessageSquare,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg gradient-accent flex items-center justify-center shadow-soft">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-display font-bold tracking-tight text-sidebar-foreground">ImobiGest</span>
            <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Premium</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
