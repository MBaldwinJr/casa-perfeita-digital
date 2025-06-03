
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
import Financiamento from "./pages/Financiamento";
import Juridico from "./pages/Juridico";
import Obras from "./pages/Obras";
import PosVenda from "./pages/PosVenda";
import Relatorios from "./pages/Relatorios";
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
            <Route path="/financiamento" element={<Financiamento />} />
            <Route path="/juridico" element={<Juridico />} />
            <Route path="/obras" element={<Obras />} />
            <Route path="/pos-venda" element={<PosVenda />} />
            <Route path="/relatorios" element={<Relatorios />} />
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
