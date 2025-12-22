-- User roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Wedding Events Table
CREATE TABLE public.wedding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  map_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible events"
ON public.wedding_events FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage events"
ON public.wedding_events FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Gallery Images Table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible gallery images"
ON public.gallery_images FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage gallery"
ON public.gallery_images FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Story Events Table
CREATE TABLE public.story_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.story_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible story events"
ON public.story_events FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage story"
ON public.story_events FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Schedule Table
CREATE TABLE public.schedule_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT NOT NULL,
  day_name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.schedule_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible schedule days"
ON public.schedule_days FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage schedule days"
ON public.schedule_days FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.schedule_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID REFERENCES public.schedule_days(id) ON DELETE CASCADE NOT NULL,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schedule items"
ON public.schedule_items FOR SELECT USING (true);

CREATE POLICY "Admins can manage schedule items"
ON public.schedule_items FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update wedding_settings policies to use admin role
DROP POLICY IF EXISTS "Authenticated users can update settings" ON public.wedding_settings;
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON public.wedding_settings;
DROP POLICY IF EXISTS "Authenticated users can delete settings" ON public.wedding_settings;

CREATE POLICY "Admins can update settings"
ON public.wedding_settings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert settings"
ON public.wedding_settings FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete settings"
ON public.wedding_settings FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at triggers
CREATE TRIGGER update_wedding_events_updated_at
BEFORE UPDATE ON public.wedding_events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_story_events_updated_at
BEFORE UPDATE ON public.story_events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.wedding_settings (key, value) VALUES 
('couple', '{"name1": "Priya", "name2": "Arjun"}'::jsonb),
('wedding_date', '{"date": "2025-12-15T10:00:00"}'::jsonb),
('footer', '{"quote": "In all the world, there is no heart for me like yours", "instagram": "https://instagram.com", "email": "priyaarjun@wedding.com"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Insert default events
INSERT INTO public.wedding_events (title, date, time, venue, address, description, map_url, display_order) VALUES
('Engagement Ceremony', 'December 13, 2025', '6:00 PM onwards', 'The Grand Ballroom', 'Hotel Taj Palace, New Delhi', 'Join us for the ring ceremony followed by cocktails and dinner.', 'https://maps.google.com', 1),
('Haldi - Groom''s Side', 'December 14, 2025', '10:00 AM - 2:00 PM', 'Arjun''s Family Residence', 'Green Park, New Delhi', 'Traditional Haldi ceremony with music, dance, and celebration.', NULL, 2),
('Haldi - Bride''s Side', 'December 14, 2025', '10:00 AM - 2:00 PM', 'Priya''s Family Residence', 'Vasant Vihar, New Delhi', 'Traditional Haldi ceremony with turmeric rituals and festivities.', NULL, 3),
('Wedding Ceremony', 'December 15, 2025', '10:00 AM onwards', 'The Royal Gardens', 'Chanakyapuri, New Delhi', 'The main wedding ceremony followed by lunch reception.', 'https://maps.google.com', 4);

-- Insert default story events
INSERT INTO public.story_events (date, title, description, image, display_order) VALUES
('Summer 2020', 'First Meeting', 'We met at a mutual friend''s gathering. What started as a casual conversation turned into hours of talking about everything and nothing.', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop', 1),
('Winter 2021', 'First Date', 'A cozy coffee date that lasted well into the evening. We knew then that this was something special.', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop', 2),
('Spring 2023', 'The Proposal', 'Under the stars on a beautiful beach, the question was asked and answered with tears of joy.', 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=400&fit=crop', 3);

-- Insert default gallery images
INSERT INTO public.gallery_images (src, alt, display_order) VALUES
('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', 'Couple photo 1', 1),
('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop', 'Couple photo 2', 2),
('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop', 'Couple photo 3', 3),
('https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400&h=300&fit=crop', 'Couple photo 4', 4),
('https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=400&h=300&fit=crop', 'Couple photo 5', 5),
('https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=300&fit=crop', 'Couple photo 6', 6),
('https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop', 'Couple photo 7', 7);

-- Insert default schedule
INSERT INTO public.schedule_days (date, day_name, display_order) VALUES
('December 13, 2025', 'Day One - Engagement', 1),
('December 14, 2025', 'Day Two - Haldi & Mehendi', 2),
('December 15, 2025', 'Day Three - Wedding', 3);

INSERT INTO public.schedule_items (day_id, time, title, description, display_order)
SELECT id, '5:00 PM', 'Guest Arrival', 'Welcome drinks and mingling', 1 FROM public.schedule_days WHERE day_name = 'Day One - Engagement'
UNION ALL
SELECT id, '6:00 PM', 'Ring Ceremony', 'The official engagement ritual', 2 FROM public.schedule_days WHERE day_name = 'Day One - Engagement'
UNION ALL
SELECT id, '7:30 PM', 'Cocktails & Music', 'Live band performance', 3 FROM public.schedule_days WHERE day_name = 'Day One - Engagement'
UNION ALL
SELECT id, '9:00 PM', 'Dinner', 'Grand buffet dinner', 4 FROM public.schedule_days WHERE day_name = 'Day One - Engagement'
UNION ALL
SELECT id, '10:00 AM', 'Haldi Ceremony', 'At respective family homes', 1 FROM public.schedule_days WHERE day_name = 'Day Two - Haldi & Mehendi'
UNION ALL
SELECT id, '4:00 PM', 'Mehendi', 'Bride''s residence - all are welcome', 2 FROM public.schedule_days WHERE day_name = 'Day Two - Haldi & Mehendi'
UNION ALL
SELECT id, '7:00 PM', 'Sangeet Night', 'Dance performances and DJ', 3 FROM public.schedule_days WHERE day_name = 'Day Two - Haldi & Mehendi'
UNION ALL
SELECT id, '8:00 AM', 'Baraat Arrival', 'Groom''s procession', 1 FROM public.schedule_days WHERE day_name = 'Day Three - Wedding'
UNION ALL
SELECT id, '10:00 AM', 'Pheras', 'Wedding rituals begin', 2 FROM public.schedule_days WHERE day_name = 'Day Three - Wedding'
UNION ALL
SELECT id, '1:00 PM', 'Lunch Reception', 'Traditional wedding feast', 3 FROM public.schedule_days WHERE day_name = 'Day Three - Wedding'
UNION ALL
SELECT id, '4:00 PM', 'Vidaai', 'Farewell ceremony', 4 FROM public.schedule_days WHERE day_name = 'Day Three - Wedding';
