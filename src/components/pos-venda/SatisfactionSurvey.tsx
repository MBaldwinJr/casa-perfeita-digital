
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SatisfactionData {
  periodo: string;
  nota: number;
  respostas: number;
}

export default function SatisfactionSurvey() {
  const satisfacao: SatisfactionData[] = [
    { periodo: "Janeiro 2024", nota: 4.8, respostas: 45 },
    { periodo: "Dezembro 2023", nota: 4.6, respostas: 38 },
    { periodo: "Novembro 2023", nota: 4.9, respostas: 42 },
  ];

  const enviarPesquisa = () => {
    toast({
      title: "Pesquisa enviada!",
      description: "A pesquisa de satisfação foi enviada aos clientes.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pesquisa de Satisfação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {satisfacao.map((pesquisa, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{pesquisa.periodo}</p>
                <p className="text-sm text-muted-foreground">{pesquisa.respostas} respostas</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-lg">{pesquisa.nota}</span>
                  <span className="text-yellow-500">★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" variant="outline" onClick={enviarPesquisa}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Enviar Nova Pesquisa
        </Button>
      </CardContent>
    </Card>
  );
}
