import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  TrendingDown, 
  Clock, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  type: 'rate_drop' | 'status_change' | 'document_reminder' | 'market_change';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface AlertSettings {
  rateDropAlerts: boolean;
  statusChangeAlerts: boolean;
  documentReminders: boolean;
  marketAlerts: boolean;
  maxRateThreshold: string;
}

export default function SmartAlerts() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'rate_drop',
      title: 'Taxa da Caixa Caiu!',
      message: 'A taxa mínima da Caixa Econômica Federal caiu para 8.16% a.a.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'status_change',
      title: 'Financiamento Aprovado',
      message: 'O financiamento do cliente João Silva foi aprovado pelo Banco do Brasil.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'document_reminder',
      title: 'Documentos Pendentes',
      message: 'Maria Santos tem 3 documentos pendentes há mais de 2 dias.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      priority: 'medium'
    }
  ]);

  const [settings, setSettings] = useState<AlertSettings>({
    rateDropAlerts: true,
    statusChangeAlerts: true,
    documentReminders: true,
    marketAlerts: false,
    maxRateThreshold: '9.5'
  });

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Simular novos alertas
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: 'market_change',
          title: 'Mudança no Mercado',
          message: 'SELIC apresentou variação de -0.1% nas últimas 24h.',
          timestamp: new Date(),
          isRead: false,
          priority: 'low'
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
    toast({
      title: "Alertas Marcados",
      description: "Todos os alertas foram marcados como lidos.",
    });
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'rate_drop': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'status_change': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'document_reminder': return <FileText className="h-4 w-4 text-yellow-500" />;
      case 'market_change': return <AlertTriangle className="h-4 w-4 text-purple-500" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-gray-300 bg-gray-50';
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  const saveSettings = () => {
    toast({
      title: "Configurações Salvas",
      description: "Suas preferências de alertas foram atualizadas.",
    });
    setShowSettings(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Alertas Inteligentes
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Notificações em tempo real sobre taxas e processos</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4 mr-1" />
                Configurar
              </Button>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Marcar Todos como Lidos
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showSettings && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-4">Configurações de Alertas</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rate-alerts">Alertas de Queda de Taxa</Label>
                  <Switch 
                    id="rate-alerts"
                    checked={settings.rateDropAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, rateDropAlerts: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="status-alerts">Mudanças de Status</Label>
                  <Switch 
                    id="status-alerts"
                    checked={settings.statusChangeAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, statusChangeAlerts: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="document-alerts">Lembretes de Documentos</Label>
                  <Switch 
                    id="document-alerts"
                    checked={settings.documentReminders}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, documentReminders: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="market-alerts">Alertas de Mercado</Label>
                  <Switch 
                    id="market-alerts"
                    checked={settings.marketAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, marketAlerts: checked }))}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="rate-threshold" className="whitespace-nowrap">Taxa máxima para alerta:</Label>
                  <Input
                    id="rate-threshold"
                    type="number"
                    step="0.1"
                    value={settings.maxRateThreshold}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxRateThreshold: e.target.value }))}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">% a.a.</span>
                </div>
                
                <Button onClick={saveSettings} size="sm">
                  Salvar Configurações
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum alerta no momento</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm ${
                    !alert.isRead ? getPriorityColor(alert.priority) : 'border-gray-200 bg-white'
                  }`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${!alert.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {alert.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.priority === 'high' ? 'destructive' : 
                                        alert.priority === 'medium' ? 'default' : 'secondary'}>
                            {alert.priority === 'high' ? 'Alta' : 
                             alert.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${!alert.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}