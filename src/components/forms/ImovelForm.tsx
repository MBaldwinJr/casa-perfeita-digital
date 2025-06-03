
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Check } from "lucide-react";

export function ImovelForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    tipo: "",
    endereco: "",
    preco: "",
    quartos: "",
    banheiros: "",
    vagas: "",
    area: "",
    descricao: "",
    status: "Disponível"
  });

  const [documentos, setDocumentos] = useState([
    { nome: "Escritura", obrigatorio: true, enviado: false },
    { nome: "IPTU", obrigatorio: true, enviado: false },
    { nome: "Matrícula", obrigatorio: true, enviado: true },
    { nome: "Habite-se", obrigatorio: false, enviado: false },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cadastrando imóvel:", formData);
    onClose();
  };

  const toggleDocumento = (index: number) => {
    setDocumentos(prev => prev.map((doc, i) => 
      i === index ? { ...doc, enviado: !doc.enviado } : doc
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Imóvel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                >
                  <option value="">Selecione</option>
                  <option value="Casa">Casa</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Apartamento">Apartamento</option>
                </select>
              </div>
              <div>
                <Label htmlFor="preco">Preço</Label>
                <Input 
                  type="text" 
                  value={formData.preco}
                  onChange={(e) => setFormData({...formData, preco: e.target.value})}
                  placeholder="R$ 450.000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input 
                value={formData.endereco}
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="quartos">Quartos</Label>
                <Input 
                  type="number" 
                  value={formData.quartos}
                  onChange={(e) => setFormData({...formData, quartos: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="banheiros">Banheiros</Label>
                <Input 
                  type="number" 
                  value={formData.banheiros}
                  onChange={(e) => setFormData({...formData, banheiros: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="vagas">Vagas</Label>
                <Input 
                  type="number" 
                  value={formData.vagas}
                  onChange={(e) => setFormData({...formData, vagas: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="area">Área (m²)</Label>
                <Input 
                  type="number" 
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Descrição detalhada do imóvel..."
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit">Salvar Imóvel</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            </div>
          </form>
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
                  <Checkbox 
                    checked={doc.enviado}
                    onCheckedChange={() => toggleDocumento(index)}
                  />
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
