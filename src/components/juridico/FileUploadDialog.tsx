import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, File, X } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "@/hooks/use-toast";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded: (file: { url: string; path: string; name: string }) => void;
  title?: string;
  description?: string;
}

export default function FileUploadDialog({
  open,
  onOpenChange,
  onFileUploaded,
  title = "Fazer Upload de Arquivo",
  description = "Selecione um arquivo para fazer upload"
}: FileUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [description_text, setDescriptionText] = useState('');
  const { uploadFile, uploading } = useFileUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo primeiro",
        variant: "destructive",
      });
      return;
    }

    const result = await uploadFile(selectedFile, 'juridico');
    if (result) {
      onFileUploaded({
        ...result,
        name: fileName || result.name
      });
      
      // Reset form
      setSelectedFile(null);
      setFileName('');
      setDescriptionText('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setFileName('');
    setDescriptionText('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="flex-1"
              />
              {selectedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {selectedFile && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <File className="h-4 w-4" />
                <span>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          {/* File Name */}
          <div className="space-y-2">
            <Label htmlFor="fileName">Nome do Arquivo (opcional)</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Nome personalizado do arquivo"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description_text}
              onChange={(e) => setDescriptionText(e.target.value)}
              placeholder="Descrição do arquivo..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Fazer Upload
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}