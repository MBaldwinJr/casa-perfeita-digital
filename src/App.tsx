
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/imoveis" element={
              <ProtectedRoute>
                <Layout>
                  <Imoveis />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/clientes" element={
              <ProtectedRoute>
                <Layout>
                  <Clientes />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/propostas" element={
              <ProtectedRoute>
                <Layout>
                  <Propostas />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/financiamento" element={
              <ProtectedRoute>
                <Layout>
                  <Financiamento />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/juridico" element={
              <ProtectedRoute>
                <Layout>
                  <Juridico />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/obras" element={
              <ProtectedRoute>
                <Layout>
                  <Obras />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/pos-venda" element={
              <ProtectedRoute>
                <Layout>
                  <PosVenda />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/relatorios" element={
              <ProtectedRoute>
                <Layout>
                  <Relatorios />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <Layout>
                  <Configuracoes />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
