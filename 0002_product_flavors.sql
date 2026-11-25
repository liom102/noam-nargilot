ALTER TABLE public.products ADD COLUMN IF NOT EXISTS flavors text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sold_out_flavors text[] NOT NULL DEFAULT '{}';