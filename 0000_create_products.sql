CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'נרגילות',
  price integer NOT NULL DEFAULT 0 CHECK (price >= 0),
  image_url text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible products are public"
ON public.products FOR SELECT
TO anon, authenticated
USING (is_visible = true);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_touch_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.products (slug, name, category, price, image_url, description, features, sort_order) VALUES
('gold-edition-yellow-black', 'נרגילת Gold Edition – צהוב/שחור', 'נרגילות', 1050,
 '/__l5e/assets-v1/c81a1998-3c91-43b8-b6c5-4388ca05e4c1/hookah-gold-yellow-black.png',
 'נרגילה מעוצבת עם צוואר בדוגמת צהוב-שחור, צלחת ומחברים בגימור זהב, ובסיס זכוכית מעושנת. נראית מדהים על כל שולחן.',
 ARRAY['צלחת ומחברים בגימור זהב','בסיס זכוכית מעושנת','צינור סיליקון ופייה שחורה'], 1),
('tactical-black-ops', 'נרגילת Tactical – שחור/כסף', 'נרגילות', 1000,
 '/__l5e/assets-v1/3319245e-a936-4fa7-ae23-4dcf4b84daf7/hookah-tactical-black.png',
 'נרגילה בסגנון טקטי עם גוף מתכת בשחור מט, בסיס זכוכית שקופה ופרט צהוב בסגנון פתיל בטיחות. מראה נקי ואגרסיבי, מושקעת בכל פרט.',
 ARRAY['גוף מתכת בשחור מט','בסיס זכוכית שקופה','צלחת ופייה תואמות, צינור סיליקון'], 2);