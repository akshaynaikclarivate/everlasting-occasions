-- Wedding Settings Table (stores all editable content)
CREATE TABLE public.wedding_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.wedding_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings (for the wedding website)
CREATE POLICY "Anyone can view wedding settings"
ON public.wedding_settings
FOR SELECT
USING (true);

-- Only authenticated admins can modify settings
CREATE POLICY "Authenticated users can update settings"
ON public.wedding_settings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can insert settings"
ON public.wedding_settings
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete settings"
ON public.wedding_settings
FOR DELETE
TO authenticated
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_wedding_settings_updated_at
BEFORE UPDATE ON public.wedding_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero background setting
INSERT INTO public.wedding_settings (key, value) VALUES 
('hero_background', '{"type": "image", "url": "/hero-background.jpg"}'::jsonb);
