
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Atendimentos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">5 urgentes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">4.8</div>
          <p className="text-xs text-muted-foreground">de 5.0 estrelas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Tempo Resposta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2.5h</div>
          <p className="text-xs text-muted-foreground">tempo médio</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Recibos Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">8</div>
          <p className="text-xs text-muted-foreground">R$ 12.400,00</p>
        </CardContent>
      </Card>
    </div>
  );
}
