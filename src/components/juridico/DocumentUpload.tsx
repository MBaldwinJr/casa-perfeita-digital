import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DocumentUploadProps {
  onUploadComplete?: (url: string, fileName: string) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // em MB
}

export default function DocumentUpload({ 
  onUploadComplete, 
  acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxFileSize = 10 
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho do arquivo
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: `O arquivo deve ter no máximo ${maxFileSize}MB.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  }, [maxFileSize, toast]);

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      // Criar path único para o arquivo
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${selectedFile.name}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('juridico-docs')
        .upload(filePath, selectedFile);

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('juridico-docs')
        .getPublicUrl(filePath);

      toast({
        title: "Upload realizado!",
        description: "Documento foi enviado com sucesso.",
      });

      onUploadComplete?.(publicUrl, selectedFile.name);
      setSelectedFile(null);
      
      // Limpar input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload de Documentos
        </CardTitle>
        <CardDescription>
          Envie documentos jurídicos (PDF, DOC, imagens). Máximo {maxFileSize}MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Selecionar Arquivo</Label>
          <Input
            id="file-upload"
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileSelect}
            className="mt-1"
          />
        </div>

        {selectedFile && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <FileText className="h-4 w-4" />
            <span className="flex-1 text-sm">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
            </span>
            <Button size="sm" variant="ghost" onClick={clearFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
            className="flex-1"
          >
            {uploading ? "Enviando..." : "Fazer Upload"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}