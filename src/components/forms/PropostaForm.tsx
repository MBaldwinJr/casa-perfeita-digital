
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Send } from "lucide-react";

export function PropostaForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    cliente: "",
    imovel: "",
    valorProposta: "",
    valorImovel: "",
    formaPagamento: "",
    prazoEntrega: "",
    observacoes: "",
    condicoes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Gerando proposta:", formData);
    onClose();
  };

  const gerarContrato = () => {
    console.log("Gerando contrato...");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Proposta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={formData.cliente}
                  onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                >
                  <option value="">Selecione o cliente</option>
                  <option value="João Silva">João Silva</option>
                  <option value="Maria Santos">Maria Santos</option>
                  <option value="Pedro Costa">Pedro Costa</option>
                </select>
              </div>
              <div>
                <Label htmlFor="imovel">Imóvel</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={formData.imovel}
                  onChange={(e) => setFormData({...formData, imovel: e.target.value})}
                >
                  <option value="">Selecione o imóvel</option>
                  <option value="Casa - Jardim América">Casa - Jardim América</option>
                  <option value="Terreno - Centro">Terreno - Centro</option>
                  <option value="Casa - Vila Nova">Casa - Vila Nova</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorImovel">Valor do Imóvel</Label>
                <Input 
                  value={formData.valorImovel}
                  onChange={(e) => setFormData({...formData, valorImovel: e.target.value})}
                  placeholder="R$ 450.000"
                />
              </div>
              <div>
                <Label htmlFor="valorProposta">Valor da Proposta</Label>
                <Input 
                  value={formData.valorProposta}
                  onChange={(e) => setFormData({...formData, valorProposta: e.target.value})}
                  placeholder="R$ 420.000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={formData.formaPagamento}
                  onChange={(e) => setFormData({...formData, formaPagamento: e.target.value})}
                >
                  <option value="">Selecione</option>
                  <option value="À vista">À vista</option>
                  <option value="Financiamento">Financiamento</option>
                  <option value="Parcelado">Parcelado</option>
                </select>
              </div>
              <div>
                <Label htmlFor="prazoEntrega">Prazo de Entrega</Label>
                <Input 
                  value={formData.prazoEntrega}
                  onChange={(e) => setFormData({...formData, prazoEntrega: e.target.value})}
                  placeholder="30 dias"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="condicoes">Condições Especiais</Label>
              <Textarea 
                value={formData.condicoes}
                onChange={(e) => setFormData({...formData, condicoes: e.target.value})}
                placeholder="Condições especiais da proposta..."
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Observações adicionais..."
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Enviar Proposta
              </Button>
              <Button type="button" variant="outline" onClick={gerarContrato}>
                <FileText className="h-4 w-4 mr-2" />
                Gerar Contrato
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status da Proposta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Proposta Enviada</span>
              <Badge className="bg-blue-500 text-white">Em Análise</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Documentação</span>
              <Badge className="bg-yellow-500 text-white">Pendente</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Aprovação Financeira</span>
              <Badge variant="outline">Aguardando</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
