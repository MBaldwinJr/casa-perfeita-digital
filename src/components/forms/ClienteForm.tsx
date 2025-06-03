
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, Check, Calculator } from "lucide-react";

export function ClienteForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    renda: "",
    profissao: "",
    estadoCivil: "",
    interesse: ""
  });

  const [documentos, setDocumentos] = useState([
    { nome: "RG", obrigatorio: true, enviado: false },
    { nome: "CPF", obrigatorio: true, enviado: true },
    { nome: "Comprovante de Renda", obrigatorio: true, enviado: false },
    { nome: "Comprovante de Residência", obrigatorio: true, enviado: false },
  ]);

  const [simulacao, setSimulacao] = useState({
    valorImovel: "",
    entrada: "",
    prazo: "360",
    taxa: "10.5"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cadastrando cliente:", formData);
    onClose();
  };

  const calcularFinanciamento = () => {
    const valor = parseFloat(simulacao.valorImovel.replace(/[^\d,]/g, '').replace(',', '.'));
    const entrada = parseFloat(simulacao.entrada.replace(/[^\d,]/g, '').replace(',', '.'));
    const valorFinanciado = valor - entrada;
    const taxa = parseFloat(simulacao.taxa) / 100 / 12;
    const parcelas = parseInt(simulacao.prazo);
    
    const prestacao = valorFinanciado * (taxa * Math.pow(1 + taxa, parcelas)) / (Math.pow(1 + taxa, parcelas) - 1);
    
    return {
      valorFinanciado,
      prestacao: prestacao.toFixed(2)
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="João Silva"
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input 
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="joao@email.com"
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="renda">Renda Mensal</Label>
                <Input 
                  value={formData.renda}
                  onChange={(e) => setFormData({...formData, renda: e.target.value})}
                  placeholder="R$ 5.000,00"
                />
              </div>
              <div>
                <Label htmlFor="profissao">Profissão</Label>
                <Input 
                  value={formData.profissao}
                  onChange={(e) => setFormData({...formData, profissao: e.target.value})}
                  placeholder="Engenheiro"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="interesse">Interesse</Label>
              <Input 
                value={formData.interesse}
                onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                placeholder="Casa 3 quartos - Jardim América"
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit">Salvar Cliente</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulação de Financiamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Valor do Imóvel</Label>
              <Input 
                value={simulacao.valorImovel}
                onChange={(e) => setSimulacao({...simulacao, valorImovel: e.target.value})}
                placeholder="R$ 450.000"
              />
            </div>
            <div>
              <Label>Entrada</Label>
              <Input 
                value={simulacao.entrada}
                onChange={(e) => setSimulacao({...simulacao, entrada: e.target.value})}
                placeholder="R$ 90.000"
              />
            </div>
          </div>
          
          {simulacao.valorImovel && simulacao.entrada && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Resultado da Simulação</h4>
              <p>Valor Financiado: R$ {calcularFinanciamento().valorFinanciado.toLocaleString()}</p>
              <p>Prestação: R$ {calcularFinanciamento().prestacao}</p>
              <p>Prazo: {simulacao.prazo} meses</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documentos.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span>{doc.nome}</span>
                  {doc.obrigatorio && <Badge variant="destructive">Obrigatório</Badge>}
                </div>
                <div className="flex items-center space-x-2">
                  {doc.enviado ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
