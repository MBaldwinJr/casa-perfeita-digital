
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      tipo: "urgente",
      titulo: "Certidão Vencida",
      mensagem: "Certidão de distribuição venceu para Casa Jardim América",
      data: "há 2 horas",
      lida: false,
      icon: AlertTriangle,
      color: "text-red-500"
    },
    {
      id: 2,
      tipo: "info",
      titulo: "Nova Proposta",
      mensagem: "Proposta recebida para Terreno Centro - Maria Santos",
      data: "há 4 horas",
      lida: false,
      icon: Info,
      color: "text-blue-500"
    },
    {
      id: 3,
      tipo: "sucesso",
      titulo: "Financiamento Aprovado",
      mensagem: "João Silva teve seu financiamento aprovado - Banco do Brasil",
      data: "há 6 horas",
      lida: true,
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      id: 4,
      tipo: "lembrete",
      titulo: "Reunião Agendada",
      mensagem: "Reunião com cliente Pedro Costa hoje às 15:00",
      data: "há 8 horas",
      lida: false,
      icon: Calendar,
      color: "text-yellow-500"
    },
  ]);

  const marcarComoLida = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      )
    );
  };

  const removerNotificacao = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const notificacaosPendentes = notifications.filter(n => !n.lida).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {notificacaosPendentes > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
              {notificacaosPendentes}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notificações</h3>
          <p className="text-sm text-muted-foreground">
            {notificacaosPendentes} não lidas
          </p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Nenhuma notificação
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 ${!notification.lida ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <notification.icon className={`h-5 w-5 mt-0.5 ${notification.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.titulo}</p>
                    <p className="text-sm text-muted-foreground">{notification.mensagem}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.data}</p>
                  </div>
                  <div className="flex space-x-1">
                    {!notification.lida && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => marcarComoLida(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removerNotificacao(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full"
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, lida: true })))}
            >
              Marcar todas como lidas
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
