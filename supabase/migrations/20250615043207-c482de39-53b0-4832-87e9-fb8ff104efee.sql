-- Fix the trigger for protocolo generation
DROP TRIGGER IF EXISTS set_protocolo_trigger ON public.atendimentos_pos_venda;

-- Recreate the trigger with proper naming
CREATE TRIGGER set_protocolo_trigger
  BEFORE INSERT ON public.atendimentos_pos_venda
  FOR EACH ROW
  EXECUTE FUNCTION public.set_protocolo();