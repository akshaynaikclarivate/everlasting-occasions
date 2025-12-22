-- Create storage bucket for wedding images
INSERT INTO storage.buckets (id, name, public) VALUES ('wedding-images', 'wedding-images', true);

-- Storage policies for wedding images
CREATE POLICY "Anyone can view wedding images"
ON storage.objects FOR SELECT
USING (bucket_id = 'wedding-images');

CREATE POLICY "Admins can upload wedding images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'wedding-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update wedding images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'wedding-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete wedding images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'wedding-images' AND public.has_role(auth.uid(), 'admin'));
