import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface UploadResult {
  url: string;
  path: string;
  name: string;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const uploadFile = async (file: File, folder: string = 'documents'): Promise<UploadResult | null> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('juridico-docs')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('juridico-docs')
        .getPublicUrl(filePath);

      toast({
        title: "Sucesso!",
        description: "Arquivo enviado com sucesso.",
      });

      return {
        url: publicUrl,
        path: filePath,
        name: file.name
      };
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from('juridico-docs')
        .remove([path]);

      if (error) throw error;

      toast({
        title: "Arquivo removido",
        description: "Arquivo foi removido com sucesso.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover arquivo",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading
  };
};