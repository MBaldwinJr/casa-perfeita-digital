-- Drop existing conflicting policies if they exist and create new ones with unique names
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Create storage policies for juridico-docs bucket
CREATE POLICY "Juridico docs - users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'juridico-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Juridico docs - users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'juridico-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Juridico docs - users can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'juridico-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Juridico docs - users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'juridico-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create RLS policies for documentos_juridicos table
CREATE POLICY "Users can view their own juridico documents" 
ON public.documentos_juridicos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own juridico documents" 
ON public.documentos_juridicos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own juridico documents" 
ON public.documentos_juridicos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own juridico documents" 
ON public.documentos_juridicos 
FOR DELETE 
USING (auth.uid() = user_id);