
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AtendimentoForm from "@/components/forms/AtendimentoForm";
import StatsOverview from "@/components/pos-venda/StatsOverview";
import AtendimentosList from "@/components/pos-venda/AtendimentosList";
import RecibosManager from "@/components/pos-venda/RecibosManager";
import SatisfactionSurvey from "@/components/pos-venda/SatisfactionSurvey";

export default function PosVenda() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pós-venda</h2>
          <p className="text-muted-foreground">Suporte ao cliente e acompanhamento</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Atendimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Atendimento</DialogTitle>
            </DialogHeader>
            <AtendimentoForm onClose={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <StatsOverview />
      
      <AtendimentosList />

      <div className="grid gap-6 md:grid-cols-2">
        <RecibosManager />
        <SatisfactionSurvey />
      </div>
    </div>
  );
}
