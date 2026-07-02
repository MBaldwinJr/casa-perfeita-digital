import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Bell, Database, Shield, Mail, Smartphone, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const [configuracoes, setConfiguracoes] = useState({
    nomeEmpresa: "Imobiliária Premium",
    email: "contato@imobiliaria.com",
    telefone: "(11) 3000-0000",
    endereco: "Av. Principal, 123 - Centro",
    notificacaoEmail: true,
    notificacaoWhatsApp: true,
    alertasVencimento: true,
    backupAutomatico: true,
    tema: "claro",
    idioma: "pt-BR",
  });

  const salvarConfiguracoes = () => {
    console.log("Configurações salvas:", configuracoes);
    toast({
      title: "Configurações salvas!",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  const usuarios = [
    { id: 1, nome: "Admin Sistema", email: "admin@sistema.com", papel: "Administrador", ativo: true },
    { id: 2, nome: "João Corretor", email: "joao@imobiliaria.com", papel: "Corretor", ativo: true },
    { id: 3, nome: "Maria Vendas", email: "maria@imobiliaria.com", papel: "Vendedor", ativo: true },
    { id: 4, nome: "Pedro Suporte", email: "pedro@imobiliaria.com", papel: "Suporte", ativo: false },
  ];

  const integracoes = [
    { nome: "WhatsApp Business", status: "Conectado", tipo: "Comunicação" },
    { nome: "Email Marketing", status: "Conectado", tipo: "Marketing" },
    { nome: "Google Maps", status: "Conectado", tipo: "Localização" },
    { nome: "Banco do Brasil", status: "Pendente", tipo: "Financeiro" },
    { nome: "Caixa Econômica", status: "Conectado", tipo: "Financeiro" },
    { nome: "Cartório Digital", status: "Desconectado", tipo: "Jurídico" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
          <p className="text-muted-foreground">Gerencie as configurações e integrações</p>
        </div>
        <Button onClick={salvarConfiguracoes}>
          <Settings className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 h-auto">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>Dados básicos da imobiliária</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                  <Input
                    id="nomeEmpresa"
                    value={configuracoes.nomeEmpresa}
                    onChange={(e) => setConfiguracoes({...configuracoes, nomeEmpresa: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Principal</Label>
                  <Input
                    id="email"
                    type="email"
                    value={configuracoes.email}
                    onChange={(e) => setConfiguracoes({...configuracoes, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={configuracoes.telefone}
                    onChange={(e) => setConfiguracoes({...configuracoes, telefone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={configuracoes.endereco}
                    onChange={(e) => setConfiguracoes({...configuracoes, endereco: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências do Sistema</CardTitle>
                <CardDescription>Configurações de aparência e localização</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tema">Tema</Label>
                  <Select value={configuracoes.tema} onValueChange={(value) => setConfiguracoes({...configuracoes, tema: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claro">Claro</SelectItem>
                      <SelectItem value="escuro">Escuro</SelectItem>
                      <SelectItem value="automatico">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="idioma">Idioma</Label>
                  <Select value={configuracoes.idioma} onValueChange={(value) => setConfiguracoes({...configuracoes, idioma: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="backup">Backup Automático</Label>
                  <Switch
                    id="backup"
                    checked={configuracoes.backupAutomatico}
                    onCheckedChange={(checked) => setConfiguracoes({...configuracoes, backupAutomatico: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Gerenciamento de Usuários
              </CardTitle>
              <CardDescription>Controle de acesso e permissões</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button>Adicionar Novo Usuário</Button>
                <div className="space-y-3">
                  {usuarios.map((usuario) => (
                    <div key={usuario.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{usuario.nome}</p>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={usuario.ativo ? "default" : "secondary"}>
                          {usuario.papel}
                        </Badge>
                        <Badge variant={usuario.ativo ? "default" : "destructive"}>
                          {usuario.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button size="sm" variant="outline">Editar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Configurações de Notificações
              </CardTitle>
              <CardDescription>Configure como e quando receber alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificacaoEmail">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">Receber alertas importantes por email</p>
                  </div>
                  <Switch
                    id="notificacaoEmail"
                    checked={configuracoes.notificacaoEmail}
                    onCheckedChange={(checked) => setConfiguracoes({...configuracoes, notificacaoEmail: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificacaoWhatsApp">Notificações por WhatsApp</Label>
                    <p className="text-sm text-muted-foreground">Receber alertas via WhatsApp Business</p>
                  </div>
                  <Switch
                    id="notificacaoWhatsApp"
                    checked={configuracoes.notificacaoWhatsApp}
                    onCheckedChange={(checked) => setConfiguracoes({...configuracoes, notificacaoWhatsApp: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="alertasVencimento">Alertas de Vencimento</Label>
                    <p className="text-sm text-muted-foreground">Alertas automáticos para documentos e contratos</p>
                  </div>
                  <Switch
                    id="alertasVencimento"
                    checked={configuracoes.alertasVencimento}
                    onCheckedChange={(checked) => setConfiguracoes({...configuracoes, alertasVencimento: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Integrações Externas
              </CardTitle>
              <CardDescription>APIs e serviços conectados ao sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integracoes.map((integracao, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{integracao.nome}</p>
                      <p className="text-sm text-muted-foreground">{integracao.tipo}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          integracao.status === "Conectado" ? "default" :
                          integracao.status === "Pendente" ? "secondary" :
                          "destructive"
                        }
                      >
                        {integracao.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        {integracao.status === "Conectado" ? "Configurar" : "Conectar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>Proteja seus dados e controle acessos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Política de Senhas</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Mínimo 8 caracteres</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Incluir números e símbolos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Autenticação de dois fatores (2FA)</span>
                  </div>
                </div>
              </div>
              <div>
                <Label>Sessão e Acesso</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tempo limite de sessão</span>
                    <Select defaultValue="120">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                        <SelectItem value="480">8 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button variant="destructive">Revogar Todas as Sessões</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Backup e Recuperação
              </CardTitle>
              <CardDescription>Proteja seus dados com backups automáticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Último Backup</h4>
                  <p className="text-sm text-muted-foreground">Hoje às 03:00</p>
                  <p className="text-sm text-green-600">✓ Sucesso</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Próximo Backup</h4>
                  <p className="text-sm text-muted-foreground">Amanhã às 03:00</p>
                  <p className="text-sm text-blue-600">Agendado</p>
                </div>
              </div>
              <div>
                <Label>Frequência de Backup</Label>
                <Select defaultValue="diario">
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button>Fazer Backup Agora</Button>
                <Button variant="outline">Restaurar Backup</Button>
                <Button variant="outline">Download Backup</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
