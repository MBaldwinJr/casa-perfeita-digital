-- Fix the generate_protocolo function to avoid column ambiguity
CREATE OR REPLACE FUNCTION public.generate_protocolo()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  protocolo_result TEXT;
BEGIN
  year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(atendimentos_pos_venda.protocolo FROM 9) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.atendimentos_pos_venda
  WHERE atendimentos_pos_venda.protocolo LIKE 'AT-' || year_part || '-%';
  
  protocolo_result := 'AT-' || year_part || '-' || LPAD(sequence_num::TEXT, 3, '0');
  
  RETURN protocolo_result;
END;
$function$