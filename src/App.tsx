
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Imoveis from "./pages/Imoveis";
import Clientes from "./pages/Clientes";
import Propostas from "./pages/Propostas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/imoveis" element={<Imoveis />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/propostas" element={<Propostas />} />
            <Route path="/financiamento" element={<div className="p-8 text-center"><h2 className="text-2xl">Módulo de Financiamento</h2><p className="text-muted-foreground">Em desenvolvimento</p></div>} />
            <Route path="/juridico" element={<div className="p-8 text-center"><h2 className="text-2xl">Módulo Jurídico</h2><p className="text-muted-foreground">Em desenvolvimento</p></div>} />
            <Route path="/obras" element={<div className="p-8 text-center"><h2 className="text-2xl">Gestão de Obras</h2><p className="text-muted-foreground">Em desenvolvimento</p></div>} />
            <Route path="/pos-venda" element={<div className="p-8 text-center"><h2 className="text-2xl">Pós-venda</h2><p className="text-muted-foreground">Em desenvolvimento</p></div>} />
            <Route path="/relatorios" element={<div className="p-8 text-center"><h2 className="text-2xl">Relatórios</h2><p className="text-muted-foreground">Em desenvolvimento</p></div>} />
            <Route path="/configuracoes" element={<div className="p-8 text-center"><h2 className="text-2xl">Configurações</h2><p className="text-muted-foreground">Em desenvolvimento</p></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
